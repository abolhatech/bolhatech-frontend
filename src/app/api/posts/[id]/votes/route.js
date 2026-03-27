import { backendRequest, errorResponse, jsonResponse, requireSession } from '../../../_lib/backend';

export async function POST(request, context) {
  try {
    const session = await requireSession();
    const { id } = await context.params;
    const body = await request.json();

    return jsonResponse(
      await backendRequest(`/posts/${id}/votes`, {
        method: 'POST',
        body,
        session,
      })
    );
  } catch (error) {
    return errorResponse(error);
  }
}
