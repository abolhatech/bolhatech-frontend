import { cookies } from 'next/headers';
import { apiSuccess, cacheHeaders } from './response';

function getBackendBaseUrl() {
  const value = process.env.BOLHATECH_API_BASE_URL;

  if (!value) {
    return null;
  }

  return value.endsWith('/') ? value : `${value}/`;
}

function buildBackendUrl(pathname, searchParams) {
  const baseUrl = getBackendBaseUrl();

  if (!baseUrl) {
    return null;
  }

  const url = new URL(pathname.replace(/^\//, ''), baseUrl);

  if (searchParams) {
    searchParams.forEach((value, key) => {
      url.searchParams.append(key, value);
    });
  }

  return url;
}

function parseSessionCookie(value) {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export async function readSession() {
  const cookieStore = await cookies();
  return parseSessionCookie(cookieStore.get('bolha_session')?.value);
}

export async function buildBackendHeaders(request) {
  const session = await readSession();
  const headers = new Headers();

  headers.set('accept', 'application/json');
  headers.set('x-user-id', session?.userId ?? 'user-guest');

  if (session?.sessionToken) {
    headers.set('x-session-token', session.sessionToken);
  }

  const forwardedLanguage = request.headers.get('accept-language');

  if (forwardedLanguage) {
    headers.set('accept-language', forwardedLanguage);
  }

  return headers;
}

export async function fetchBackendJson(pathname, { request, searchParams } = {}) {
  const url = buildBackendUrl(pathname, searchParams);

  if (!url) {
    return null;
  }

  try {
    const headers = await buildBackendHeaders(request);
    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    const contentType = response.headers.get('content-type') ?? '';
    const payload = contentType.includes('application/json')
      ? await response.json()
      : await response.text();

    return {
      ok: response.ok,
      status: response.status,
      payload,
      url: url.toString(),
    };
  } catch (error) {
    console.warn(`[api] falha ao consultar backend em ${url.toString()}; usando fallback local`);
    console.warn(error);
    return null;
  }
}

export async function proxyBackendGet(
  request,
  pathname,
  { searchParams, cacheSeconds = 300, fallback }
) {
  const backendResponse = await fetchBackendJson(pathname, {
    request,
    searchParams,
  });

  if (backendResponse?.ok) {
    const payload = backendResponse.payload;

    if (payload && typeof payload === 'object' && 'data' in payload) {
      return apiSuccess(payload.data, {
        meta: {
          ...(payload.meta ?? {}),
          source: 'backend',
        },
        headers: cacheHeaders(cacheSeconds),
      });
    }

    return apiSuccess(payload, {
      meta: {
        source: 'backend',
      },
      headers: cacheHeaders(cacheSeconds),
    });
  }

  if (backendResponse && !backendResponse.ok) {
    console.warn(
      `[api] backend respondeu ${backendResponse.status} em ${backendResponse.url}; usando fallback local`
    );
  }

  return fallback();
}
