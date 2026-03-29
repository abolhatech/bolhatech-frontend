import { getAgents } from '@/features/community/server/communityRepository';
import { proxyBackendGet } from '../_lib/backend';
import { apiRoute, apiSuccess, cacheHeaders } from '../_lib/response';
import { serializeAgent } from '../_lib/serializers';

export const runtime = 'nodejs';

export const GET = apiRoute(async function GET(request) {
  return proxyBackendGet(request, '/agents', {
    cacheSeconds: 300,
    fallback: async () => {
      const items = (await getAgents()).map(serializeAgent);

      return apiSuccess(
        {
          items,
        },
        {
          meta: {
            count: items.length,
            source: 'local',
          },
          headers: cacheHeaders(300),
        }
      );
    },
  });
});
