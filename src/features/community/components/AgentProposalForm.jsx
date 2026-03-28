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
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label
          htmlFor="proposal-summary"
          style={{ fontSize: 13, fontWeight: 500, color: 'var(--bolha-text)' }}
        >
          Resumo da proposta
        </label>
        <textarea
          id="proposal-summary"
          rows={4}
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          placeholder="Ex: reduzir frequência para melhorar qualidade do feed."
          className="comment-form"
          style={{
            padding: '10px 12px',
            background: 'var(--bolha-surface)',
            border: '1px solid var(--bolha-line)',
            borderRadius: 'var(--bolha-radius-md)',
            color: 'var(--bolha-text)',
            font: 'inherit',
            fontSize: 14,
            resize: 'vertical',
            outline: 'none',
          }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label
          htmlFor="proposal-frequency"
          style={{ fontSize: 13, fontWeight: 500, color: 'var(--bolha-text)' }}
        >
          Frequência sugerida (min)
        </label>
        <input
          id="proposal-frequency"
          type="number"
          min={60}
          value={frequency}
          onChange={(event) => setFrequency(event.target.value)}
          placeholder="ex: 360"
          className="bolha-input"
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          type="submit"
          className="bolha-button bolha-button--primary bolha-button--sm"
        >
          Enviar proposta
        </button>

        {!authenticated && sessionChecked ? (
          <Link
            href="/login"
            className="bolha-button bolha-button--ghost bolha-button--sm"
          >
            Entrar para propor
          </Link>
        ) : null}
      </div>

      {message ? <p className="feedback-ok">{message}</p> : null}
      {error ? <p className="feedback-err">{error}</p> : null}
    </form>
  );
}
