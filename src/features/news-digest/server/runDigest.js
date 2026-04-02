import {
  classifyDigestItems,
  generateDigestPost,
  translateDigestItems,
} from './openai';
import { getNewsDigestConfig } from './config';
import { shortlistNewsItems } from './audit';
import { collectRssItems } from './rss';
import {
  createDigestRun,
  getDigestRunByKey,
  publishDigestRunIfMissingPost,
  getMargaretAgent,
  markDigestRunFailed,
  markDigestRunNoop,
  persistDigestOutput,
} from './repository';

function formatRunDate(date, timeZone) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

function buildRunKey(runDate) {
  return `margaret-digest:${runDate}`;
}

function buildFallbackAudit(shortlist, config) {
  const selectedItems = shortlist.slice(0, config.maxSelectedItems).map((item, index) => ({
    ...item,
    rank_position: index + 1,
    selection_reason: item.reasons.join(', ') || 'relevância editorial do dia',
  }));

  return {
    dominant_theme: 'Ritmo do ciclo tech nas últimas horas',
    selection_summary:
      'Seleção por heurística local por falta de OPENAI_API_KEY. Revisar manualmente se necessário.',
    selected_items: selectedItems.map((item) => ({
      url: item.url,
      rank_position: item.rank_position,
      selection_reason: item.selection_reason,
    })),
    selectedItems,
  };
}

function buildFallbackPost({ runDate, selectedItems, dominantTheme }) {
  const title = `Panorama Tech — ${runDate.replaceAll('-', '/')}`;
  const summary = `${selectedItems.length} sinais do dia escolhidos pela Margaret, com o ceticismo regulamentar de quem já viu hype demais.`;
  const sections = selectedItems.map((item) => ({
    heading: item.title,
    body: `${item.summary} Margaret colocou isso na lista porque ${item.selection_reason}.`,
    source_url: item.url,
    source_label: item.sourceLabel,
  }));
  const blocks = sections.map((section) =>
    [section.heading, '', section.body, `Fonte: ${section.source_url}`].join('\n')
  );

  return {
    title,
    summary,
    sections,
    content: [
      'por Margaret | correspondente de campo para o noticiário que envelhece rápido',
      '',
      `${dominantTheme}. Foi esse o humor do expediente.`,
      '',
      '---',
      '',
      blocks.join('\n\n---\n\n'),
      '',
      '---',
      '',
      '— Margaret',
    ].join('\n'),
  };
}

function resolveSelectedItems(shortlist, selectedSpecs) {
  return selectedSpecs
    .map((spec) => {
      const item = shortlist.find((candidate) => candidate.url === spec.url);

      if (!item) return null;

      return {
        ...item,
        rank_position: spec.rank_position,
        selection_reason: spec.selection_reason,
      };
    })
    .filter(Boolean)
    .sort((left, right) => left.rank_position - right.rank_position);
}

function applyTranslatedItems(selectedItems, translatedItems) {
  const translationMap = new Map(
    translatedItems.map((item) => [item.url, item])
  );

  return selectedItems.map((item) => {
    const translated = translationMap.get(item.url);

    if (!translated) {
      return item;
    }

    return {
      ...item,
      title: translated.translated_title || item.title,
      summary: translated.translated_summary || item.summary,
      rawText: `${translated.translated_title || item.title}\n${translated.translated_summary || item.summary}`.trim(),
    };
  });
}

export async function runMargaretDailyDigest({ now = new Date(), force = false } = {}) {
  const config = getNewsDigestConfig();
  const runDate = formatRunDate(now, config.timezone);
  const runKey = buildRunKey(runDate);
  const existingRun = await getDigestRunByKey(runKey);

  if (!force && existingRun?.status === 'completed' && existingRun?.created_post_id) {
    return {
      ok: true,
      skipped: true,
      reason: 'already_completed',
      run: existingRun,
    };
  }

  if (!force && existingRun?.status === 'completed' && !existingRun?.created_post_id) {
    const repairedPostId = await publishDigestRunIfMissingPost(existingRun.id);

    return {
      ok: true,
      skipped: false,
      repaired: true,
      reason: 'published_missing_post',
      runId: existingRun.id,
      postId: repairedPostId,
      runDate,
      title: existingRun.title ?? existingRun.output_json?.title ?? null,
      selectedCount: existingRun.items_selected ?? 0,
    };
  }

  const margaret = await getMargaretAgent();

  if (!margaret?.system_prompt) {
    throw new Error('Agente Margaret não encontrado ou sem system_prompt.');
  }

  const run = await createDigestRun({
    runKey,
    runDate,
    model: config.writerModel,
    agentId: margaret.id,
  });

  try {
    const collectedItems = await collectRssItems(config);
    const shortlist = shortlistNewsItems(collectedItems, config);

    if (!shortlist.length) {
      const auditJson = {
        reason: 'empty_shortlist',
        collected_items: collectedItems.length,
      };

      await markDigestRunNoop(run.id, {
        itemsCollected: collectedItems.length,
        itemsShortlisted: 0,
        auditJson,
      });

      return {
        ok: true,
        skipped: true,
        reason: 'empty_shortlist',
        runId: run.id,
      };
    }

    let auditOutput;

    if (config.openAiApiKey) {
      const auditResult = await classifyDigestItems({
        apiKey: config.openAiApiKey,
        model: config.classifierModel,
        items: shortlist,
        systemPrompt: margaret.system_prompt,
        runDate,
      });

      auditOutput = {
        dominant_theme: auditResult.dominant_theme,
        selection_summary: auditResult.selection_summary,
        selectedItems: resolveSelectedItems(shortlist, auditResult.selected_items),
      };
    } else {
      auditOutput = buildFallbackAudit(shortlist, config);
    }

    if (!auditOutput.selectedItems.length) {
      await markDigestRunNoop(run.id, {
        itemsCollected: collectedItems.length,
        itemsShortlisted: shortlist.length,
        auditJson: auditOutput,
      });

      return {
        ok: true,
        skipped: true,
        reason: 'no_selected_items',
        runId: run.id,
      };
    }

    if (config.openAiApiKey) {
      const translationResult = await translateDigestItems({
        apiKey: config.openAiApiKey,
        model: config.classifierModel,
        items: auditOutput.selectedItems.map((item) => ({
          url: item.url,
          title: item.title,
          summary: item.summary,
        })),
      });

      auditOutput.selectedItems = applyTranslatedItems(
        auditOutput.selectedItems,
        translationResult.items || []
      );
    }

    const postOutput = config.openAiApiKey
      ? await generateDigestPost({
          apiKey: config.openAiApiKey,
          model: config.writerModel,
          systemPrompt: margaret.system_prompt,
          runDate,
          selectedItems: auditOutput.selectedItems,
          dominantTheme: auditOutput.dominant_theme,
          selectionSummary: auditOutput.selection_summary,
        })
      : buildFallbackPost({
          runDate,
          selectedItems: auditOutput.selectedItems,
          dominantTheme: auditOutput.dominant_theme,
        });

    const createdPostId = await persistDigestOutput({
      runId: run.id,
      title: postOutput.title,
      summary: postOutput.summary,
      dominantTheme: auditOutput.dominant_theme,
      auditJson: {
        selection_summary: auditOutput.selection_summary,
        dominant_theme: auditOutput.dominant_theme,
        shortlist,
        selected_items: auditOutput.selectedItems,
      },
      outputJson: postOutput,
      itemsCollected: collectedItems.length,
      itemsShortlisted: shortlist.length,
      itemsSelected: auditOutput.selectedItems.length,
      selectedItems: auditOutput.selectedItems,
    });

    return {
      ok: true,
      skipped: false,
      runId: run.id,
      postId: createdPostId,
      runDate,
      title: postOutput.title,
      selectedCount: auditOutput.selectedItems.length,
    };
  } catch (error) {
    await markDigestRunFailed(run.id, error.message);
    throw error;
  }
}
