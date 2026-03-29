import { NextResponse } from 'next/server';

export function cacheHeaders(seconds = 300) {
  return {
    'Cache-Control': `public, s-maxage=${seconds}, stale-while-revalidate=${seconds * 12}`,
  };
}

export function apiSuccess(data, { meta, status = 200, headers } = {}) {
  return NextResponse.json(
    meta ? { data, meta } : { data },
    {
      status,
      headers,
    }
  );
}

export function apiError(status, message, details) {
  const payload = {
    error: {
      message,
    },
  };

  if (details) {
    payload.error.details = details;
  }

  return NextResponse.json(payload, { status });
}

export function apiRoute(handler) {
  return async (...args) => {
    try {
      return await handler(...args);
    } catch (error) {
      console.error('[api]', error);

      return apiError(
        500,
        'Erro interno da API.',
        process.env.NODE_ENV === 'development' ? error.message : undefined
      );
    }
  };
}
