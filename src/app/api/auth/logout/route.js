import { cookies } from 'next/headers';
import { SESSION_COOKIE_NAME, jsonResponse } from '../../_lib/backend';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);

  return jsonResponse({ ok: true });
}
