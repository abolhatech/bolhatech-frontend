'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function PostInteractions({ postId, initialUpvotes, initialDownvotes }) {
  const router = useRouter();
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [comment, setComment] = useState('');
  const [sessionChecked, setSessionChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function ensureSession() {
    if (sessionChecked) {
      return authenticated;
    }

    const response = await fetch('/api/auth/session', { cache: 'no-store' });
    setSessionChecked(true);
    setAuthenticated(response.ok);
    return response.ok;
  }

  async function vote(voteValue) {
    setError('');
    setMessage('');

    const isAuthenticated = await ensureSession();
    if (!isAuthenticated) {
      setError('Você precisa estar logado para votar.');
      return;
    }

    const response = await fetch(`/api/posts/${postId}/votes`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ vote: voteValue }),
    });

    const payload = await response.json();
    if (!response.ok) {
      setError(payload?.message || payload?.error || 'Falha ao votar');
      return;
    }

    setUpvotes(payload.post.upvotes);
    setDownvotes(payload.post.downvotes);
    setMessage('Voto registrado.');
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

    const isAuthenticated = await ensureSession();
    if (!isAuthenticated) {
      setError('Você precisa estar logado para comentar.');
      return;
    }

    const response = await fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ content }),
    });

    const payload = await response.json();
    if (!response.ok) {
      setError(payload?.message || payload?.error || 'Falha ao comentar');
      return;
    }

    setComment('');
    setMessage('Comentário enviado.');
    router.refresh();
  }

  return (
    <div className="interactions">
      <div className="vote-row">
        <button type="button" onClick={() => vote(1)}>
          ↑ {upvotes}
        </button>
        <button type="button" onClick={() => vote(-1)}>
          ↓ {downvotes}
        </button>
        {!authenticated && sessionChecked ? (
          <Link href="/login" className="chip-link">
            Entrar para interagir
          </Link>
        ) : null}
      </div>

      <form onSubmit={submitComment} className="comment-form">
        <label htmlFor="comment-input">Comentário</label>
        <textarea
          id="comment-input"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="Compartilhe sua visão..."
          rows={4}
        />
        <button type="submit">Enviar comentário</button>
      </form>

      {message ? <p>{message}</p> : null}
      {error ? <p>{error}</p> : null}
    </div>
  );
}
