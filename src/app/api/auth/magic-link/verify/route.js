import { cookies } from 'next/headers';
import { SESSION_COOKIE_NAME, backendRequest, errorResponse, jsonResponse } from '../../../_lib/backend';

export async function POST(request) {
  try {
    const body = await request.json();
    const response = await backendRequest('/auth/magic-link/verify', {
      method: 'POST',
      body,
      headers: {
        'x-user-id': 'user-guest',
      },
    });

    const session = response?.session;
    if (!session?.sessionToken || !session?.userId) {
      return jsonResponse(
        {
          error: 'invalid_session_payload',
          message: 'Magic link verification did not return a valid session',
        },
        502
      );
    }

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 14,
    });

    return jsonResponse({ ok: true, session });
  } catch (error) {
    return errorResponse(error);
  }
}
