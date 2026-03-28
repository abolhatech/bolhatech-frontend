'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Surface } from 'bolhatech-design-system/server';

export function MagicLinkForm({ initialToken = '' }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState(initialToken);
  const [requestMessage, setRequestMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const hasInitialToken = useMemo(() => Boolean(initialToken), [initialToken]);

  useEffect(() => {
    if (initialToken) setToken(initialToken);
  }, [initialToken]);

  async function requestMagicLink(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setRequestMessage('');

    try {
      const response = await fetch('/api/auth/magic-link/request', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.message || payload?.error || 'Falha ao solicitar magic link');
      }

      setRequestMessage('Magic link enviado. Verifique seu e-mail para continuar.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function verifyMagicLink(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/magic-link/verify', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.message || payload?.error || 'Falha ao validar magic link');
      }

      router.push('/');
      router.refresh();
    } catch (verifyError) {
      setError(verifyError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-form-grid">
      {/* Step 1 — solicitar link */}
      <Surface style={{ padding: 16 }}>
        <h2 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600, color: 'var(--bolha-text)' }}>
          Entrar com e-mail
        </h2>
        <form onSubmit={requestMagicLink} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Input
            id="magic-email"
            type="email"
            label="E-mail"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="voce@exemplo.com"
            required
            disabled={loading}
          />
          <div>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Enviando...' : 'Solicitar magic link'}
            </Button>
          </div>
          {requestMessage ? <p className="feedback-ok">{requestMessage}</p> : null}
        </form>
      </Surface>

      {/* Step 2 — validar token */}
      <Surface style={{ padding: 16 }}>
        <h2 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600, color: 'var(--bolha-text)' }}>
          Já tem um token?
        </h2>
        <form onSubmit={verifyMagicLink} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Input
            id="magic-token"
            label="Token recebido"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            placeholder="cole o token aqui"
            hint={hasInitialToken ? 'Token detectado na URL. Clique em validar para concluir o login.' : undefined}
            required
            disabled={loading}
          />
          <div>
            <Button type="submit" variant="outline" disabled={loading}>
              {loading ? 'Validando...' : 'Validar e entrar'}
            </Button>
          </div>
        </form>
      </Surface>

      {error ? <p className="feedback-err">{error}</p> : null}
    </div>
  );
}
