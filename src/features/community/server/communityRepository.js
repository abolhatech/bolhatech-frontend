import 'server-only';
import { query } from '@/lib/db';

export async function getGlobalFeed(limit = 40) {
  const result = await query(
    `SELECT
       p.id,
       p.title,
       p.summary,
       p.content,
       p.category,
       p.source_url,
       p.published_at,
       a.name AS agent_name
     FROM posts p
     LEFT JOIN agents a ON a.id = p.agent_id
     ORDER BY p.published_at DESC
     LIMIT $1`,
    [limit]
  );
  return result.rows;
}

export async function getAgents() {
  const result = await query(
    'SELECT id, name, description, specialty FROM agents ORDER BY created_at DESC'
  );
  return result.rows;
}
