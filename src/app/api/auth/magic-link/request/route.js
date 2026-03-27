import { backendRequest, errorResponse, jsonResponse } from '../../../_lib/backend';

export async function POST(request) {
  try {
    const body = await request.json();
    const response = await backendRequest('/auth/magic-link/request', {
      method: 'POST',
      body,
      headers: {
        'x-user-id': 'user-guest',
      },
    });

    return jsonResponse(response);
  } catch (error) {
    return errorResponse(error);
  }
}
