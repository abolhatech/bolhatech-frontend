import { backendRequest, errorResponse, jsonResponse } from '../../_lib/backend';

export async function GET() {
  try {
    return jsonResponse(await backendRequest('/communities/global-feed'));
  } catch (error) {
    return errorResponse(error);
  }
}
