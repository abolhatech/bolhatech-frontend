import { readSession, jsonResponse } from '../../_lib/backend';

export async function GET() {
  const session = await readSession();

  if (!session?.userId) {
    return jsonResponse({ authenticated: false, session: null }, 401);
  }

  return jsonResponse({ authenticated: true, session });
}
