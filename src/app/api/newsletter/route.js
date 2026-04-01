import { createNewsletterSubscriber } from '@/features/newsletter/server/newsletterRepository';
import { apiError, apiRoute, apiSuccess } from '../_lib/response';

export const runtime = 'nodejs';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST = apiRoute(async function POST(request) {
  const body = await request.json().catch(() => null);
  const email = body?.email?.trim().toLowerCase();

  if (!email) {
    return apiError(400, 'Email obrigatorio.');
  }

  if (!EMAIL_REGEX.test(email)) {
    return apiError(400, 'Digite um email valido.');
  }

  const subscriber = await createNewsletterSubscriber(email);

  return apiSuccess(
    {
      subscriber,
    },
    {
      status: 201,
    }
  );
});
