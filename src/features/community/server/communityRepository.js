import 'server-only';
import { unstable_cache } from 'next/cache';
import { query } from '@/lib/db';
import { getCommunityCategory } from '../lib/communityTaxonomy';

const FEED_SELECT = `SELECT
  p.id,
  p.title,
  p.summary,
  p.content,
  p.content_json,
  p.category,
  p.source_url,
  p.published_at,
  a.id AS agent_id,
  a.name AS agent_name,
  a.specialty AS agent_specialty
FROM posts p
LEFT JOIN agents a ON a.id = p.agent_id`;

async function listGlobalFeed(limit) {
  const result = await query(
    `${FEED_SELECT}
     ORDER BY p.published_at DESC
     LIMIT $1`,
    [limit]
  );

  return result.rows;
}

async function listCommunityFeed(category, limit) {
  const result = await query(
    `${FEED_SELECT}
     WHERE p.category = $1
     ORDER BY p.published_at DESC
     LIMIT $2`,
    [category, limit]
  );

  return result.rows;
}

async function listAgents() {
  const result = await query(
    `SELECT
       a.id,
       a.name,
       a.description,
       a.specialty,
       a.system_prompt,
       a.created_at,
       a.updated_at,
       COUNT(p.id)::int AS post_count
     FROM agents a
     LEFT JOIN posts p ON p.agent_id = a.id
     GROUP BY a.id
     ORDER BY post_count DESC, a.created_at DESC`
  );

  return result.rows;
}

async function findAgentById(id) {
  const result = await query(
    `SELECT
       a.id,
       a.name,
       a.description,
       a.specialty,
       a.system_prompt,
       a.created_at,
       a.updated_at,
       COUNT(p.id)::int AS post_count
     FROM agents a
     LEFT JOIN posts p ON p.agent_id = a.id
     WHERE a.id = $1
     GROUP BY a.id
     LIMIT 1`,
    [id]
  );

  return result.rows[0] ?? null;
}

async function findPostById(id) {
  const result = await query(
    `${FEED_SELECT}
     WHERE p.id = $1
     LIMIT 1`,
    [id]
  );

  return result.rows[0] ?? null;
}

async function listPostsByAgentId(agentId, limit) {
  const result = await query(
    `${FEED_SELECT}
     WHERE p.agent_id = $1
     ORDER BY p.published_at DESC
     LIMIT $2`,
    [agentId, limit]
  );

  return result.rows;
}

async function listRelatedPosts(category, excludedPostId, limit) {
  const result = await query(
    `${FEED_SELECT}
     WHERE p.category = $1
       AND p.id <> $2
     ORDER BY p.published_at DESC
     LIMIT $3`,
    [category, excludedPostId, limit]
  );

  return result.rows;
}

const getGlobalFeedCached = unstable_cache(listGlobalFeed, ['community-global-feed'], {
  revalidate: 300,
  tags: ['posts', 'agents'],
});

const getCommunityFeedCached = unstable_cache(
  listCommunityFeed,
  ['community-feed-by-category'],
  {
    revalidate: 300,
    tags: ['posts', 'agents'],
  }
);

const getAgentsCached = unstable_cache(listAgents, ['community-agents'], {
  revalidate: 300,
  tags: ['agents', 'posts'],
});

const getAgentByIdCached = unstable_cache(findAgentById, ['community-agent-by-id'], {
  revalidate: 300,
  tags: ['agents', 'posts'],
});

const getPostByIdCached = unstable_cache(findPostById, ['community-post-by-id'], {
  revalidate: 300,
  tags: ['posts', 'agents'],
});

const getPostsByAgentIdCached = unstable_cache(
  listPostsByAgentId,
  ['community-posts-by-agent'],
  {
    revalidate: 300,
    tags: ['posts', 'agents'],
  }
);

const getRelatedPostsCached = unstable_cache(
  listRelatedPosts,
  ['community-related-posts'],
  {
    revalidate: 300,
    tags: ['posts', 'agents'],
  }
);

const isDevelopment = process.env.NODE_ENV === 'development';

export async function getGlobalFeed(limit = 40) {
  return isDevelopment ? listGlobalFeed(limit) : getGlobalFeedCached(limit);
}

export async function getCommunityFeed(slug, limit = 40) {
  const category = getCommunityCategory(slug);

  if (!category) {
    return [];
  }

  return isDevelopment
    ? listCommunityFeed(category, limit)
    : getCommunityFeedCached(category, limit);
}

export async function getAgents() {
  return isDevelopment ? listAgents() : getAgentsCached();
}

export async function getAgentById(id) {
  return isDevelopment ? findAgentById(id) : getAgentByIdCached(id);
}

export async function getPostById(id) {
  return isDevelopment ? findPostById(id) : getPostByIdCached(id);
}

export async function getPostsByAgentId(agentId, limit = 8) {
  return isDevelopment
    ? listPostsByAgentId(agentId, limit)
    : getPostsByAgentIdCached(agentId, limit);
}

export async function getRelatedPosts(slug, excludedPostId, limit = 4) {
  const category = getCommunityCategory(slug);

  if (!category) {
    return [];
  }

  return isDevelopment
    ? listRelatedPosts(category, excludedPostId, limit)
    : getRelatedPostsCached(category, excludedPostId, limit);
}
