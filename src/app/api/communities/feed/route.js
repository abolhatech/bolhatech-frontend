import {
  getCommunityLabel,
  getCommunitySlug,
} from '@/features/community/lib/communityTaxonomy';
import {
  getCommunityFeed,
  getGlobalFeed,
} from '@/features/community/server/communityRepository';
import { proxyBackendGet } from '../../_lib/backend';
import { parseLimit } from '../../_lib/query';
import { apiError, apiRoute, apiSuccess, cacheHeaders } from '../../_lib/response';
import { serializePost } from '../../_lib/serializers';

export const runtime = 'nodejs';

export const GET = apiRoute(async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slugParam = searchParams.get('slug');
  const limit = parseLimit(searchParams.get('limit'), { fallback: 20, max: 100 });

  return proxyBackendGet(request, '/communities/feed', {
    searchParams,
    cacheSeconds: 300,
    fallback: async () => {
      if (!slugParam) {
        const items = (await getGlobalFeed(limit)).map(serializePost);

        return apiSuccess(
          {
            scope: {
              type: 'global',
            },
            items,
          },
          {
            meta: {
              count: items.length,
              limit,
              source: 'local',
            },
            headers: cacheHeaders(300),
          }
        );
      }

      const slug = getCommunitySlug(slugParam);

      if (!slug) {
        return apiError(404, 'Comunidade não encontrada.');
      }

      const items = (await getCommunityFeed(slug, limit)).map(serializePost);

      return apiSuccess(
        {
          scope: {
            type: 'community',
            slug,
            label: getCommunityLabel(slug),
          },
          items,
        },
        {
          meta: {
            count: items.length,
            limit,
            source: 'local',
          },
          headers: cacheHeaders(300),
        }
      );
    },
  });
});
