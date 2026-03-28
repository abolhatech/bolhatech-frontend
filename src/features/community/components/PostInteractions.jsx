'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'bolhatech-design-system/server';
import { VoteBar } from 'bolhatech-design-system/client';

export function PostInteractions({ postId, initialUpvotes, initialDownvotes }) {
  const router = useRouter();
  const [upvotes, setUpvotes] = useState(initialUpvotes ?? 0);
  const [downvotes, setDownvotes] = useState(initialDownvotes ?? 0);
  const [userVote, setUserVote] = useState(null); // 'up' | 'down' | null
  const [comment, setComment] = useState('');
  const [sessionChecked, setSessionChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function ensureSession() {
    if (sessionChecked) return authenticated;
    const response = await fetch('/api/auth/session', { cache: 'no-store' });
    setSessionChecked(true);
    setAuthenticated(response.ok);
    return response.ok;
  }

  async function vote(voteValue) {
    setError('');
    setMessage('');
    setLoading(true);

    const isAuthenticated = await ensureSession();
    if (!isAuthenticated) {
      setError('Você precisa estar logado para votar.');
      setLoading(false);
      return;
    }

    const response = await fetch(`/api/posts/${postId}/votes`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ vote: voteValue }),
    });

    const payload = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(payload?.message || payload?.error || 'Falha ao votar');
      return;
    }

    setUpvotes(payload.post.upvotes);
    setDownvotes(payload.post.downvotes);
    setUserVote(voteValue === 1 ? 'up' : 'down');
    router.refresh();
  }

  async function submitComment(event) {
    event.preventDefault();
    setError('');
    setMessage('');

    const content = comment.trim();
    if (!content) {
      setError('Digite um comentário antes de enviar.');
      return;
    }

    setLoading(true);
    const isAuthenticated = await ensureSession();
    if (!isAuthenticated) {
      setError('Você precisa estar logado para comentar.');
      setLoading(false);
      return;
    }

    const response = await fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ content }),
    });

    const payload = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(payload?.message || payload?.error || 'Falha ao comentar');
      return;
    }

    setComment('');
    setMessage('Comentário enviado.');
    router.refresh();
  }

  const score = upvotes - downvotes;

  return (
    <div className="interactions">
      {/* Votação */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <VoteBar
          score={score}
          userVote={userVote}
          onUpvote={() => vote(1)}
          onDownvote={() => vote(-1)}
          disabled={loading}
        />

        {!authenticated && sessionChecked ? (
          <Button as="a" href="/login" variant="ghost" size="sm">
            Entrar para interagir
          </Button>
        ) : null}
      </div>

      {/* Formulário de comentário */}
      <form onSubmit={submitComment} className="comment-form" id="comentarios">
        <label
          htmlFor="comment-input"
          style={{ fontSize: 13, fontWeight: 500, color: 'var(--bolha-muted)' }}
        >
          Deixe um comentário
        </label>
        <textarea
          id="comment-input"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="Compartilhe sua visão..."
          rows={4}
          disabled={loading}
        />
        <div>
          <Button type="submit" variant="primary" size="sm" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar comentário'}
          </Button>
        </div>
      </form>

      {message ? <p className="feedback-ok">{message}</p> : null}
      {error ? <p className="feedback-err">{error}</p> : null}
    </div>
  );
}
