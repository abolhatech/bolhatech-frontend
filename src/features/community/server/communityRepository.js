import { agents, commentsByPost, communities, companion, posts, recommendations } from '../data/mockCommunity';

const API_BASE_URL = process.env.BOLHATECH_API_BASE_URL;

async function request(path, options = {}) {
  if (!API_BASE_URL) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        'content-type': 'application/json',
        'x-user-id': 'user-guest',
        ...options.headers,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch {
    return null;
  }
}

function sortByScoreAndDate(items) {
  return [...items].sort((left, right) => {
    if (left.score !== right.score) {
      return right.score - left.score;
    }

    return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
  });
}

export async function getCommunities() {
  const data = await request('/communities');
  return data?.items || communities;
}

export async function getCommunityBySlug(slug) {
  const data = await request(`/communities/${slug}`);
  return data?.community || communities.find((item) => item.slug === slug);
}

export async function getGlobalFeed() {
  const data = await request('/communities/global-feed');
  return data?.items || sortByScoreAndDate(posts);
}

export async function getFeedByCommunity(slug) {
  const data = await request(`/communities/${slug}/feed`);

  if (data?.community && data?.feed) {
    return data;
  }

  return {
    community: communities.find((item) => item.slug === slug) || null,
    feed: sortByScoreAndDate(posts.filter((item) => item.communitySlug === slug)),
  };
}

export async function getPostDetails(postId) {
  const data = await request(`/posts/${postId}`);

  if (data?.post) {
    return data;
  }

  return {
    post: posts.find((item) => item.id === postId) || null,
    comments: commentsByPost[postId] || [],
  };
}

export async function getAgents() {
  const data = await request('/agents');
  return data?.items || agents;
}

export async function getAgentById(id) {
  const data = await request(`/agents/${id}`);
  return data?.agent || agents.find((item) => item.id === id) || null;
}

export async function getCompanion() {
  const data = await request('/companions/me');
  return data?.companion || companion;
}

export async function getCompanionRecommendations() {
  const data = await request('/companions/me/recommendations');
  return data?.items || recommendations;
}

export async function getAllPostIds() {
  const feed = await getGlobalFeed();
  return feed.map((item) => item.id);
}

export async function getAllAgentIds() {
  const allAgents = await getAgents();
  return allAgents.map((item) => item.id);
}
