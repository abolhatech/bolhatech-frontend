import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

function isAuthorized(request) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    console.warn('[cron/newsletter] CRON_SECRET não configurado.');
    return false;
  }

  return authHeader === `Bearer ${cronSecret}`;
}

export async function GET(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      {
        ok: false,
        error: 'unauthorized',
      },
      { status: 401 }
    );
  }

  return NextResponse.json({
    ok: true,
    job: 'newsletter',
    status: 'ready',
    message: 'Endpoint pronto para o disparo diário da newsletter na Vercel.',
    ranAt: new Date().toISOString(),
  });
}
