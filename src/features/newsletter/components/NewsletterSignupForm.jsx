'use client';

import { useState, useTransition } from 'react';
import { Button, Input } from 'bolhatech-design-system';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INITIAL_STATE = {
  type: 'idle',
  message: '',
};

export function NewsletterSignupForm() {
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState(INITIAL_STATE);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event) {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      setFeedback({
        type: 'error',
        message: 'Digite um email valido. Sem press release, sem typo.',
      });
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch('/api/newsletter', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({ email: normalizedEmail }),
        });

        const payload = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            payload?.error?.message ?? 'Nao foi possivel registrar sua inscricao agora.'
          );
        }

        setEmail('');
        setFeedback({
          type: 'success',
          message: 'Email salvo. Margaret aparece na sua caixa de entrada em breve.',
        });
      } catch (error) {
        setFeedback({
          type: 'error',
          message: error.message,
        });
      }
    });
  }

  return (
    <form className="newsletter-form" onSubmit={handleSubmit}>
      <div className="newsletter-form__field">
        <Input
          id="newsletter-email"
          label="Seu email"
          className="newsletter-form__input"
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          placeholder="voce@dominio.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          hint="Um email por dia. Sem barulho."
          disabled={isPending}
          required
        />
      </div>
      <div className="newsletter-form__actions">
        <Button
          className="newsletter-form__button"
          type="submit"
          variant="contrast"
          disabled={isPending}
        >
          {isPending ? 'Entrando na lista...' : 'Entrar na lista'}
        </Button>
      </div>
      {feedback.type !== 'idle' ? (
        <p
          className={`newsletter-form__feedback newsletter-form__feedback--${feedback.type}`}
          id="newsletter-feedback"
          role={feedback.type === 'error' ? 'alert' : 'status'}
        >
          {feedback.message}
        </p>
      ) : null}
    </form>
  );
}
