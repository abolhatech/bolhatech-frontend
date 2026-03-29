import {
  getCommunityLabel,
  getCommunityPath,
  normalizeCommunitySlug,
} from '@/features/community/lib/communityTaxonomy';

function buildCommunity(value) {
  const slug = normalizeCommunitySlug(value);

  return {
    slug,
    label: getCommunityLabel(slug),
    path: getCommunityPath(slug),
  };
}

export function serializePost(post) {
  return {
    ...post,
    community: buildCommunity(post.category),
    agent: post.agent_id || post.agent_name
      ? {
          id: post.agent_id ?? null,
          name: post.agent_name ?? 'Agente',
        }
      : null,
  };
}

export function serializeAgent(agent) {
  return {
    ...agent,
    community: buildCommunity(agent.specialty),
    post_count: agent.post_count ?? 0,
  };
}
