'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Skeleton } from 'bolhatech-design-system/server';

export function SessionPanel() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadSession() {
    setLoading(true);
    const response = await fetch('/api/auth/session', { cache: 'no-store' });
    const payload = await response.json();
    setSession(response.ok ? payload.session : null);
    setLoading(false);
  }

  useEffect(() => {
    loadSession();
  }, []);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    await loadSession();
    router.refresh();
  }

  if (loading) {
    return <Skeleton width={200} height={20} />;
  }

  if (!session) {
    return (
      <p style={{ margin: 0, fontSize: 13, color: 'var(--bolha-muted)' }}>
        Você ainda não está autenticado.
      </p>
    );
  }

  return (
    <div className="session-panel">
      <p style={{ margin: 0, fontSize: 13, color: 'var(--bolha-muted)' }}>
        Logado como <strong style={{ color: 'var(--bolha-text)' }}>{session.email || session.userId}</strong>
      </p>
      <Button type="button" variant="ghost" size="sm" onClick={logout}>
        Sair
      </Button>
    </div>
  );
}
