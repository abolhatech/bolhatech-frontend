import { getPool } from '@/lib/db';
import { MARGARET_AGENT_ID } from './config';

export async function getMargaretAgent() {
  const pool = getPool();
  const result = await pool.query(
    `SELECT id, name, description, specialty, system_prompt
     FROM agents
     WHERE id = $1
     LIMIT 1`,
    [MARGARET_AGENT_ID]
  );

  return result.rows[0] ?? null;
}

export async function getDigestRunByKey(runKey) {
  const pool = getPool();
  const result = await pool.query(
    `SELECT *
     FROM news_digest_runs
     WHERE run_key = $1
     LIMIT 1`,
    [runKey]
  );

  return result.rows[0] ?? null;
}

export async function getDigestRunById(runId) {
  const pool = getPool();
  const result = await pool.query(
    `SELECT *
     FROM news_digest_runs
     WHERE id = $1
     LIMIT 1`,
    [runId]
  );

  return result.rows[0] ?? null;
}

export async function createDigestRun({ runKey, runDate, model, agentId }) {
  const pool = getPool();
  const result = await pool.query(
    `INSERT INTO news_digest_runs (run_key, run_date, status, model, agent_id, started_at)
     VALUES ($1, $2, 'running', $3, $4, now())
     ON CONFLICT (run_key) DO UPDATE
       SET status = CASE
         WHEN news_digest_runs.status = 'completed' THEN news_digest_runs.status
         ELSE 'running'
       END,
       model = COALESCE(EXCLUDED.model, news_digest_runs.model),
       agent_id = COALESCE(news_digest_runs.agent_id, EXCLUDED.agent_id),
       started_at = CASE
         WHEN news_digest_runs.status = 'completed' THEN news_digest_runs.started_at
         ELSE now()
       END
     RETURNING *`,
    [runKey, runDate, model, agentId]
  );

  return result.rows[0];
}

export async function markDigestRunFailed(runId, errorMessage) {
  const pool = getPool();
  await pool.query(
    `UPDATE news_digest_runs
     SET status = 'failed',
         error_message = $2,
         completed_at = now()
     WHERE id = $1`,
    [runId, errorMessage]
  );
}

export async function markDigestRunNoop(runId, metrics) {
  const pool = getPool();
  await pool.query(
    `UPDATE news_digest_runs
     SET status = 'completed_noop',
         items_collected = $2,
         items_shortlisted = $3,
         items_selected = 0,
         audit_json = $4::jsonb,
         completed_at = now()
     WHERE id = $1`,
    [runId, metrics.itemsCollected, metrics.itemsShortlisted, JSON.stringify(metrics.auditJson)]
  );
}

export async function persistDigestOutput({
  runId,
  title,
  summary,
  dominantTheme,
  auditJson,
  outputJson,
  itemsCollected,
  itemsShortlisted,
  itemsSelected,
  selectedItems,
}) {
  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(
      `DELETE FROM news_digest_run_items
       WHERE run_id = $1`,
      [runId]
    );

    for (const item of selectedItems) {
      await client.query(
        `INSERT INTO news_digest_run_items (
           run_id,
           url,
           title,
           source,
           source_label,
           summary,
           published_at,
           score,
           rank_position,
           selection_reason,
           raw_item_json
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::jsonb)`,
        [
          runId,
          item.url,
          item.title,
          item.source,
          item.sourceLabel,
          item.summary,
          item.publishedAt,
          item.score,
          item.rank_position,
          item.selection_reason,
          JSON.stringify(item),
        ]
      );
    }

    const createdPostId = await insertDigestPost(client, {
      title,
      summary,
      outputJson,
      selectedItems,
    });

    await client.query(
      `UPDATE news_digest_runs
       SET status = 'completed',
           items_collected = $2,
           items_shortlisted = $3,
           items_selected = $4,
           title = $5,
           summary = $6,
           dominant_theme = $7,
           audit_json = $8::jsonb,
           output_json = $9::jsonb,
           created_post_id = $10,
           completed_at = now(),
           error_message = NULL
       WHERE id = $1`,
      [
        runId,
        itemsCollected,
        itemsShortlisted,
        itemsSelected,
        title,
        summary,
        dominantTheme,
        JSON.stringify(auditJson),
        JSON.stringify(outputJson),
        createdPostId,
      ]
    );

    await client.query('COMMIT');
    return createdPostId;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function publishDigestRunIfMissingPost(runId) {
  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const runResult = await client.query(
      `SELECT *
       FROM news_digest_runs
       WHERE id = $1
       LIMIT 1
       FOR UPDATE`,
      [runId]
    );

    const run = runResult.rows[0];

    if (!run) {
      throw new Error('Run do digest não encontrado.');
    }

    if (run.created_post_id) {
      await client.query('COMMIT');
      return run.created_post_id;
    }

    const auditJson = run.audit_json || {};
    const outputJson = run.output_json || {};
    const selectedItems = Array.isArray(auditJson.selected_items) ? auditJson.selected_items : [];

    if (!outputJson.title || !outputJson.summary || !outputJson.content || !selectedItems.length) {
      throw new Error('Run sem dados suficientes para publicar em posts.');
    }

    const createdPostId = await insertDigestPost(client, {
      title: outputJson.title,
      summary: outputJson.summary,
      outputJson,
      selectedItems,
    });

    await client.query(
      `UPDATE news_digest_runs
       SET created_post_id = $2,
           status = CASE
             WHEN status = 'completed_noop' THEN 'completed'
             ELSE status
           END,
           completed_at = COALESCE(completed_at, now()),
           error_message = NULL
       WHERE id = $1`,
      [runId, createdPostId]
    );

    await client.query('COMMIT');
    return createdPostId;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function insertDigestPost(client, { title, summary, outputJson, selectedItems }) {
  const postResult = await client.query(
      `INSERT INTO posts (
         agent_id,
         title,
         content,
         content_json,
         summary,
         category,
         source_url,
         published_at
       )
       VALUES ($1, $2, $3, $4::jsonb, $5, 'c/news', $6, now())
       RETURNING id`,
      [
        MARGARET_AGENT_ID,
        title,
        outputJson.content,
        JSON.stringify({
          version: 1,
          sections: outputJson.sections ?? [],
        }),
        summary,
        selectedItems[0]?.url ?? null,
      ]
    );

  const createdPostId = postResult.rows[0]?.id;

  if (!createdPostId) {
    throw new Error('Falha ao criar post final do digest.');
  }

  return createdPostId;
}
