import 'server-only';
import { query } from '@/lib/db';

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

export async function createNewsletterSubscriber(email) {
  const normalizedEmail = normalizeEmail(email);

  const result = await query(
    `INSERT INTO newsletter_subscribers (email)
     VALUES ($1)
     ON CONFLICT (email)
     DO UPDATE SET
       status = 'active',
       agent_name = 'Margaret',
       source = 'site'
     RETURNING id, email, status, subscribed_at`,
    [normalizedEmail]
  );

  return result.rows[0];
}
