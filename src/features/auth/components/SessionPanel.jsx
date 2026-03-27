'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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
    return <p>Carregando sessão...</p>;
  }

  if (!session) {
    return <p>Você ainda não está autenticado.</p>;
  }

  return (
    <div className="session-panel">
      <p>Logado como: {session.email || session.userId}</p>
      <button type="button" onClick={logout}>
        Sair
      </button>
    </div>
  );
}
