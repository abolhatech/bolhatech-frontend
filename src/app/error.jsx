'use client';

import { useEffect } from 'react';
import { Button } from 'bolhatech-design-system';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error('[app/error]', error);
  }, [error]);

  return (
    <section className="page article-page">
      <div
        style={{
          display: 'grid',
          gap: 16,
          padding: 24,
          background: 'var(--bolha-surface)',
          border: '1px solid var(--bolha-line)',
          borderRadius: 'var(--bolha-radius-lg)',
        }}
      >
        <div>
          <p style={{ margin: 0, fontSize: 12, color: 'var(--bolha-subtle)' }}>
            Erro inesperado
          </p>
          <h1 style={{ margin: '8px 0 0', fontSize: 24, color: 'var(--bolha-text)' }}>
            Não conseguimos carregar esta tela agora.
          </h1>
        </div>

        <p style={{ margin: 0, fontSize: 14, color: 'var(--bolha-muted)' }}>
          Tente novamente. Se o problema continuar, vale revisar as variáveis de ambiente e a conexão com o banco.
        </p>

        <div className="inline-actions">
          <Button type="button" onClick={reset}>
            Tentar de novo
          </Button>
        </div>
      </div>
    </section>
  );
}
