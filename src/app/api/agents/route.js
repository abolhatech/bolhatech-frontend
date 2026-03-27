import { backendRequest, errorResponse, jsonResponse } from '../_lib/backend';

export async function GET() {
  try {
    return jsonResponse(await backendRequest('/agents'));
  } catch (error) {
    return errorResponse(error);
  }
}
