import {
  COMMUNITY_SLUGS,
  getCommunityLabel,
  getCommunityPath,
} from '@/features/community/lib/communityTaxonomy';
import { proxyBackendGet } from '../_lib/backend';
import { apiRoute, apiSuccess, cacheHeaders } from '../_lib/response';

export const runtime = 'nodejs';

export const GET = apiRoute(async function GET(request) {
  return proxyBackendGet(request, '/communities', {
    cacheSeconds: 3600,
    fallback: async () => {
      const communities = COMMUNITY_SLUGS.map((slug) => ({
        slug,
        label: getCommunityLabel(slug),
        path: getCommunityPath(slug),
      }));

      return apiSuccess(
        {
          items: communities,
        },
        {
          meta: {
            count: communities.length,
            source: 'local',
          },
          headers: cacheHeaders(3600),
        }
      );
    },
  });
});
