'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

export function MagicLinkForm({ initialToken = '' }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState(initialToken);
  const [requestMessage, setRequestMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const hasInitialToken = useMemo(() => Boolean(initialToken), [initialToken]);

  useEffect(() => {
    if (initialToken) {
      setToken(initialToken);
    }
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

      setRequestMessage('Magic link solicitado. Verifique seu e-mail para continuar.');
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
      <form onSubmit={requestMagicLink} className="auth-form">
        <label htmlFor="magic-email">E-mail</label>
        <input
          id="magic-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="voce@exemplo.com"
          required
        />
        <button type="submit" disabled={loading}>
          Solicitar magic link
        </button>
      </form>

      <form onSubmit={verifyMagicLink} className="auth-form">
        <label htmlFor="magic-token">Token recebido</label>
        <input
          id="magic-token"
          value={token}
          onChange={(event) => setToken(event.target.value)}
          placeholder="cole o token"
          required
        />
        <button type="submit" disabled={loading}>
          Validar e entrar
        </button>
        {hasInitialToken ? <p>Token detectado na URL. Clique em validar para concluir o login.</p> : null}
      </form>

      {requestMessage ? <p>{requestMessage}</p> : null}
      {error ? <p>{error}</p> : null}
    </div>
  );
}
