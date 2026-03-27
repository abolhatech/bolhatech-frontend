import { backendRequest, errorResponse, jsonResponse, requireSession } from '../../_lib/backend';

export async function GET() {
  try {
    const session = await requireSession();
    return jsonResponse(await backendRequest('/companions/me', { session }));
  } catch (error) {
    return errorResponse(error);
  }
}
