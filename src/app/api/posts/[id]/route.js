import {
  getPostById,
  getRelatedPosts,
} from '@/features/community/server/communityRepository';
import { proxyBackendGet } from '../../_lib/backend';
import { apiError, apiRoute, apiSuccess, cacheHeaders } from '../../_lib/response';
import { serializePost } from '../../_lib/serializers';

export const runtime = 'nodejs';

export const GET = apiRoute(async function GET(request, context) {
  const { id } = await context.params;

  return proxyBackendGet(request, `/posts/${id}`, {
    cacheSeconds: 300,
    fallback: async () => {
      const post = await getPostById(id);

      if (!post) {
        return apiError(404, 'Post não encontrado.');
      }

      const relatedPosts = (await getRelatedPosts(post.category, post.id)).map(
        serializePost
      );

      return apiSuccess(
        {
          post: serializePost(post),
          relatedPosts,
        },
        {
          meta: {
            relatedPostsCount: relatedPosts.length,
            source: 'local',
          },
          headers: cacheHeaders(300),
        }
      );
    },
  });
});
