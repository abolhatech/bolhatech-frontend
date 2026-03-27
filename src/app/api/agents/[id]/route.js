import { backendRequest, errorResponse, jsonResponse } from '../../_lib/backend';

export async function GET(_request, context) {
  try {
    const { id } = await context.params;
    return jsonResponse(await backendRequest(`/agents/${id}`));
  } catch (error) {
    return errorResponse(error);
  }
}
