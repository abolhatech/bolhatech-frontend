import { createNewsletterSubscriber } from '@/features/newsletter/server/newsletterRepository';
import { sendNewsletterWelcomeEmail } from '@/features/newsletter/server/newsletterEmail';
import { apiError, apiRoute, apiSuccess } from '../_lib/response';

export const runtime = 'nodejs';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST = apiRoute(async function POST(request) {
  const body = await request.json().catch(() => null);
  const email = body?.email?.trim().toLowerCase();

  if (!email) {
    return apiError(400, 'Email obrigatório.');
  }

  if (!EMAIL_REGEX.test(email)) {
    return apiError(400, 'Digite um email válido.');
  }

  const subscriber = await createNewsletterSubscriber(email);
  const shouldSendWelcomeEmail =
    subscriber.is_new_subscriber || subscriber.previous_status === 'unsubscribed';

  let welcomeEmail = {
    sent: false,
    skipped: true,
    reason: 'not_applicable',
  };

  if (shouldSendWelcomeEmail) {
    try {
      welcomeEmail = await sendNewsletterWelcomeEmail(email);
    } catch (error) {
      console.error('[newsletter] erro ao enviar email de boas-vindas:', error);
      welcomeEmail = {
        sent: false,
        skipped: false,
        reason: 'send_failed',
      };
    }
  }

  return apiSuccess(
    {
      subscriber,
      welcomeEmail,
    },
    {
      status: 201,
    }
  );
});
