import { revalidateTag } from 'next/cache';
import { apiError, apiRoute, apiSuccess } from '@/app/api/_lib/response';
import { runMargaretDailyDigest } from '@/features/news-digest/server/runDigest';

export const runtime = 'nodejs';

function isAuthorized(request) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    console.warn('[cron/margaret-digest] CRON_SECRET não configurado.');
    return false;
  }

  return authHeader === `Bearer ${cronSecret}`;
}

export const GET = apiRoute(async function GET(request) {
  if (!isAuthorized(request)) {
    return apiError(401, 'unauthorized');
  }

  const force = request.nextUrl.searchParams.get('force') === '1';
  const result = await runMargaretDailyDigest({ force });

  if (!result.skipped) {
    revalidateTag('posts');
    revalidateTag('agents');
  }

  return apiSuccess({
    job: 'margaret-digest',
    ...result,
    ranAt: new Date().toISOString(),
  });
});
