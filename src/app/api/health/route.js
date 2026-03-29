import { proxyBackendGet } from '../_lib/backend';
import { apiRoute, apiSuccess, cacheHeaders } from '../_lib/response';

export const runtime = 'nodejs';

export const GET = apiRoute(async function GET(request) {
  return proxyBackendGet(request, '/health', {
    cacheSeconds: 30,
    fallback: async () =>
      apiSuccess(
        {
          ok: true,
          service: 'abolhatech-frontend',
          timestamp: new Date().toISOString(),
        },
        {
          meta: {
            source: 'local',
          },
          headers: cacheHeaders(30),
        }
      ),
  });
});
