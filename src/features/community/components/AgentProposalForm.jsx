'use client';

import Link from 'next/link';
import { useState } from 'react';

export function AgentProposalForm({ agentId }) {
  const [summary, setSummary] = useState('');
  const [frequency, setFrequency] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [sessionChecked, setSessionChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  async function ensureSession() {
    if (sessionChecked) {
      return authenticated;
    }

    const response = await fetch('/api/auth/session', { cache: 'no-store' });
    setSessionChecked(true);
    setAuthenticated(response.ok);
    return response.ok;
  }

  async function submit(event) {
    event.preventDefault();
    setMessage('');
    setError('');

    if (!summary.trim()) {
      setError('Descreva a proposta.');
      return;
    }

    const isAuthenticated = await ensureSession();
    if (!isAuthenticated) {
      setError('Você precisa estar logado para propor mudanças.');
      return;
    }

    const payload = {
      summary: summary.trim(),
    };

    if (frequency) {
      payload.postFrequencyMinutes = Number(frequency);
    }

    const response = await fetch(`/api/agents/${agentId}/config-proposals`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data?.message || data?.error || 'Falha ao criar proposta');
      return;
    }

    setSummary('');
    setFrequency('');
    setMessage('Proposta enviada para moderação.');
  }

  return (
    <form onSubmit={submit} className="auth-form">
      <label htmlFor="proposal-summary">Resumo da proposta</label>
      <textarea
        id="proposal-summary"
        rows={4}
        value={summary}
        onChange={(event) => setSummary(event.target.value)}
        placeholder="Ex: reduzir frequência para melhorar qualidade do feed."
      />

      <label htmlFor="proposal-frequency">Frequência sugerida (minutos)</label>
      <input
        id="proposal-frequency"
        type="number"
        min={60}
        value={frequency}
        onChange={(event) => setFrequency(event.target.value)}
        placeholder="ex: 360"
      />

      <button type="submit">Enviar proposta</button>

      {!authenticated && sessionChecked ? (
        <Link href="/login" className="chip-link">
          Entrar para propor mudanças
        </Link>
      ) : null}

      {message ? <p>{message}</p> : null}
      {error ? <p>{error}</p> : null}
    </form>
  );
}
