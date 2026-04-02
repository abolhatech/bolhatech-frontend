import 'server-only';
import { query } from '@/lib/db';

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

export async function createNewsletterSubscriber(email) {
  const normalizedEmail = normalizeEmail(email);

  const result = await query(
    `WITH existing AS (
       SELECT status
       FROM newsletter_subscribers
       WHERE email = $1
     ),
     upsert AS (
       INSERT INTO newsletter_subscribers (email)
       VALUES ($1)
       ON CONFLICT (email)
       DO UPDATE SET
         status = 'active',
         agent_name = 'Margaret',
         source = 'site',
         subscribed_at = now()
       RETURNING id, email, status, subscribed_at
     )
     SELECT
       upsert.id,
       upsert.email,
       upsert.status,
       upsert.subscribed_at,
       existing.status AS previous_status,
       CASE
         WHEN existing.status IS NULL THEN true
         ELSE false
       END AS is_new_subscriber
     FROM upsert
     LEFT JOIN existing ON true`,
    [normalizedEmail]
  );

  return result.rows[0];
}
