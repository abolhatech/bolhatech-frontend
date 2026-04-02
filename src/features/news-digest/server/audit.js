function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getHoursAgo(isoDate) {
  const published = new Date(isoDate).getTime();
  return Math.max((Date.now() - published) / 36e5, 0);
}

function scoreItem(item) {
  let score = 0;
  const reasons = [];
  const lowered = `${item.title} ${item.summary}`.toLowerCase();
  const hoursAgo = getHoursAgo(item.publishedAt);

  if (hoursAgo <= 6) {
    score += 4;
    reasons.push('muito_recente');
  } else if (hoursAgo <= 18) {
    score += 3;
    reasons.push('recente');
  } else if (hoursAgo <= 36) {
    score += 1.5;
    reasons.push('ainda_na_janela');
  }

  if (item.keywords.length >= 3) {
    score += 3;
    reasons.push('tema_forte_do_dia');
  } else if (item.keywords.length >= 1) {
    score += 1.5;
    reasons.push('tema_tech_relevante');
  }

  if (/(openai|anthropic|google|meta|microsoft|apple|nvidia|github|vercel)/i.test(lowered)) {
    score += 2;
    reasons.push('empresa_central_do_ecossistema');
  }

  if (/(launch|model|pricing|security|funding|browser|api|agent|llm|gpu|cloud)/i.test(lowered)) {
    score += 1.5;
    reasons.push('angulo_editorial_util');
  }

  if (item.source === 'ars-technica') {
    score += 1;
    reasons.push('fonte_com_contexto');
  }

  if (item.summary.length >= 120) {
    score += 0.5;
    reasons.push('resumo_suficiente');
  }

  return {
    ...item,
    score: Number(score.toFixed(2)),
    reasons,
    dedupeKey: normalizeText(`${item.title} ${item.summary}`).slice(0, 180),
  };
}

export function shortlistNewsItems(items, config) {
  const cutoffMs = Date.now() - config.lookbackHours * 36e5;
  const dedupeKeys = new Set();

  return items
    .filter((item) => new Date(item.publishedAt).getTime() >= cutoffMs)
    .map(scoreItem)
    .sort((left, right) => {
      if (left.score !== right.score) {
        return right.score - left.score;
      }

      return new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime();
    })
    .filter((item) => {
      if (dedupeKeys.has(item.dedupeKey)) {
        return false;
      }

      dedupeKeys.add(item.dedupeKey);
      return true;
    })
    .slice(0, config.shortlistSize);
}
