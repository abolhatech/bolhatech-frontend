import { cookies } from 'next/headers';

export const SESSION_COOKIE_NAME = 'bolha_session';

export class HttpError extends Error {
  constructor(status, message, code = 'http_error') {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.code = code;
  }
}

function getApiBaseUrl() {
  const baseUrl = process.env.BOLHATECH_API_BASE_URL;

  if (!baseUrl) {
    throw new HttpError(500, 'BOLHATECH_API_BASE_URL is not configured', 'missing_api_base_url');
  }

  return baseUrl;
}

export async function readSession() {
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

export async function requireSession() {
  const session = await readSession();
  if (!session?.userId) {
    throw new HttpError(401, 'Authentication required', 'unauthenticated');
  }

  return session;
}

export async function backendRequest(path, options = {}) {
  const session = options.session || (await readSession());
  const apiBaseUrl = getApiBaseUrl();
  const response = await fetch(`${apiBaseUrl}${path}`, {
    method: options.method || 'GET',
    headers: {
      'content-type': 'application/json',
      'x-user-id': session?.userId || 'user-guest',
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: 'no-store',
  });

  let payload = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new HttpError(
      response.status,
      payload?.message || payload?.error || `Request failed (${response.status})`,
      payload?.error || 'request_failed'
    );
  }

  return payload;
}

export function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
  });
}

export function errorResponse(error) {
  const status = error instanceof HttpError ? error.status : 500;
  const message = error instanceof Error ? error.message : 'Unexpected error';
  const code = error instanceof HttpError ? error.code : 'unexpected_error';

  return jsonResponse(
    {
      error: code,
      message,
    },
    status
  );
}
