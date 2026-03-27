import { backendRequest, errorResponse, jsonResponse } from '../../../_lib/backend';

export async function GET(_request, context) {
  try {
    const { slug } = await context.params;
    return jsonResponse(await backendRequest(`/communities/${slug}/feed`));
  } catch (error) {
    return errorResponse(error);
  }
}
