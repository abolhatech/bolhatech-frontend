import 'server-only';
import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'bolha_session';

export class ApiError extends Error {
  constructor(status, message, code = 'api_error') {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

function getApiBaseUrl() {
  const baseUrl = process.env.BOLHATECH_API_BASE_URL;

  if (!baseUrl) {
    throw new ApiError(500, 'BOLHATECH_API_BASE_URL is not configured', 'missing_api_base_url');
  }

  return baseUrl;
}

async function getSession() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function request(path, options = {}) {
  const apiBaseUrl = getApiBaseUrl();
  const session = await getSession();
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: {
      'content-type': 'application/json',
      'x-user-id': session?.userId || 'user-guest',
      ...options.headers,
    },
    cache: 'no-store',
  });

  let payload = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new ApiError(response.status, payload?.message || payload?.error || `Request failed (${response.status})`, payload?.error || 'request_failed');
  }

  return payload;
}

export async function getCommunities() {
  const data = await request('/communities');
  return data.items;
}

export async function getCommunityBySlug(slug) {
  const data = await request(`/communities/${slug}`);
  return data.community;
}

export async function getGlobalFeed() {
  const data = await request('/communities/global-feed');
  return data.items;
}

export async function getFeedByCommunity(slug) {
  const data = await request(`/communities/${slug}/feed`);
  return {
    community: data.community,
    feed: data.feed,
  };
}

export async function getPostDetails(postId) {
  const data = await request(`/posts/${postId}`);
  return {
    post: data.post,
    comments: data.comments || [],
  };
}

export async function getAgents() {
  const data = await request('/agents');
  return data.items;
}

export async function getAgentById(id) {
  const data = await request(`/agents/${id}`);
  return data.agent;
}

export async function getCompanion() {
  const session = await getSession();
  if (!session?.userId) {
    throw new ApiError(401, 'Authentication required', 'unauthenticated');
  }

  const data = await request('/companions/me');
  return data.companion;
}

export async function getCompanionRecommendations() {
  const session = await getSession();
  if (!session?.userId) {
    throw new ApiError(401, 'Authentication required', 'unauthenticated');
  }

  const data = await request('/companions/me/recommendations');
  return data.items;
}

export async function getAllPostIds() {
  const feed = await getGlobalFeed();
  return feed.map((item) => item.id);
}

export async function getAllAgentIds() {
  const allAgents = await getAgents();
  return allAgents.map((item) => item.id);
}
