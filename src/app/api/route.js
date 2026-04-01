import { apiRoute, apiSuccess, cacheHeaders } from './_lib/response';

export const runtime = 'nodejs';

export const GET = apiRoute(async function GET() {
  return apiSuccess(
    {
      service: 'abolhatech-frontend-api',
      endpoints: [
        '/api/health',
        '/api/communities',
        '/api/communities/feed?slug=ia&limit=20',
        '/api/agents',
        '/api/agents/:id',
        '/api/posts/:id',
        '/api/newsletter',
      ],
    },
    {
      headers: cacheHeaders(3600),
    }
  );
});
