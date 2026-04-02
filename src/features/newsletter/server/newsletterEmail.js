import 'server-only';
import { getCanonicalUrl } from '@/lib/site';

const RESEND_API_URL = 'https://api.resend.com/emails';
const DEFAULT_FROM_EMAIL = 'Margaret <newsletter@abolhatech.com.br>';

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function getResendConfig() {
  return {
    apiKey: process.env.RESEND_API_KEY,
    from: process.env.RESEND_FROM_EMAIL || DEFAULT_FROM_EMAIL,
  };
}

function buildWelcomeEmailHtml(recipientEmail) {
  const homeUrl = getCanonicalUrl('/');
  const newsletterUrl = getCanonicalUrl('/newsletter');
  const escapedEmail = escapeHtml(recipientEmail);

  return `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Margaret na sua inbox</title>
  </head>
  <body style="margin:0;background:#f4f4f5;color:#18181b;font-family:Inter,Segoe UI,Helvetica Neue,sans-serif;">
    <div style="margin:0 auto;max-width:640px;padding:32px 20px 48px;">
      <div style="margin-bottom:20px;">
        <p style="margin:0 0 10px;color:#a1a1aa;font-size:12px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;">
          Newsletter diária
        </p>
        <h1 style="margin:0;color:#18181b;font-size:42px;line-height:0.96;letter-spacing:-0.05em;">
          Margaret na sua inbox.
        </h1>
      </div>

      <div style="border:1px solid #e4e4e7;border-radius:18px;background:#ffffff;padding:24px;box-shadow:0 1px 2px rgba(0,0,0,0.05);">
        <p style="margin:0 0 14px;color:#92400e;font-size:12px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;">
          Leitura de campo
        </p>
        <p style="margin:0 0 14px;color:#18181b;font-size:16px;line-height:1.7;">
          Seu email, <span style="color:#71717a;">${escapedEmail}</span>, entrou na lista.
        </p>
        <p style="margin:0 0 14px;color:#18181b;font-size:16px;line-height:1.7;">
          A partir daqui funciona assim: eu acompanho o ciclo diário de anúncios, lançamentos e barulho
          para você não precisar morar dentro dele.
        </p>
        <p style="margin:0 0 14px;color:#18181b;font-size:16px;line-height:1.7;">
          Quando tiver algo que mereça inbox, você recebe. Quando for só hype fazendo pose de pauta,
          eu chamo de hype e seguimos a vida.
        </p>
        <p style="margin:0;color:#71717a;font-size:15px;line-height:1.7;">
          Resumo curto. Contexto rápido. Ceticismo normal.
        </p>
      </div>

      <div style="margin-top:20px;">
        <a
          href="${newsletterUrl}"
          style="display:inline-block;border-radius:12px;background:#18181b;color:#f4f4f5;padding:12px 18px;font-size:14px;font-weight:700;text-decoration:none;"
        >
          Voltar para a newsletter
        </a>
        <a
          href="${homeUrl}"
          style="display:inline-block;margin-left:12px;color:#71717a;font-size:14px;text-decoration:none;"
        >
          Abrir a Bolha Tech
        </a>
      </div>

      <p style="margin:28px 0 0;color:#71717a;font-size:13px;line-height:1.6;">
        A Bolha Tech editorialmente recusa hype. Eu sou a exceção intencional. Alguém precisava fazer o trabalho sujo.
      </p>
    </div>
  </body>
</html>`;
}

function buildWelcomeEmailText() {
  return [
    'Margaret na sua inbox.',
    '',
    'Seu email entrou na lista.',
    'A partir daqui funciona assim: eu acompanho o ciclo diário de anúncios, lançamentos e barulho para você não precisar morar dentro dele.',
    'Quando tiver algo que mereça inbox, você recebe. Quando for só hype fazendo pose de pauta, eu chamo de hype e seguimos a vida.',
    '',
    'Resumo curto. Contexto rápido. Ceticismo normal.',
    '',
    `Newsletter: ${getCanonicalUrl('/newsletter')}`,
    `Site: ${getCanonicalUrl('/')}`,
  ].join('\n');
}

export async function sendNewsletterWelcomeEmail(email) {
  return sendNewsletterWelcomeEmailForSubscriber({ email });
}

function buildIdempotencyKey(subscriber) {
  const normalizedEmail = String(subscriber.email || '').trim().toLowerCase();
  const subscribedAt = subscriber.subscribed_at
    ? new Date(subscriber.subscribed_at).toISOString()
    : 'no-subscription-timestamp';

  return `newsletter-welcome:${subscriber.id || normalizedEmail}:${subscribedAt}`;
}

export async function sendNewsletterWelcomeEmailForSubscriber(subscriber) {
  const { apiKey, from } = getResendConfig();
  const email = String(subscriber?.email || '').trim().toLowerCase();

  if (!apiKey) {
    console.warn('[newsletter] RESEND_API_KEY não configurada; pulando email de boas-vindas');
    return { sent: false, skipped: true, reason: 'missing_api_key' };
  }

  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': buildIdempotencyKey(subscriber),
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: 'Margaret na sua inbox',
      html: buildWelcomeEmailHtml(email),
      text: buildWelcomeEmailText(),
    }),
    cache: 'no-store',
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      payload?.message ||
      payload?.error?.message ||
      'Falha ao enviar email de boas-vindas pela Resend.';

    throw new Error(message);
  }

  return {
    sent: true,
    id: payload?.id ?? null,
  };
}
