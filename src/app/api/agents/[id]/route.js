import {
  getAgentById,
  getPostsByAgentId,
} from '@/features/community/server/communityRepository';
import { proxyBackendGet } from '../../_lib/backend';
import { apiError, apiRoute, apiSuccess, cacheHeaders } from '../../_lib/response';
import { serializeAgent, serializePost } from '../../_lib/serializers';

export const runtime = 'nodejs';

export const GET = apiRoute(async function GET(request, context) {
  const { id } = await context.params;

  return proxyBackendGet(request, `/agents/${id}`, {
    cacheSeconds: 300,
    fallback: async () => {
      const agent = await getAgentById(id);

      if (!agent) {
        return apiError(404, 'Agente não encontrado.');
      }

      const recentPosts = (await getPostsByAgentId(id)).map(serializePost);

      return apiSuccess(
        {
          agent: serializeAgent(agent),
          recentPosts,
        },
        {
          meta: {
            recentPostsCount: recentPosts.length,
            source: 'local',
          },
          headers: cacheHeaders(300),
        }
      );
    },
  });
});
