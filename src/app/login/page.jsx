import { Eyebrow, SectionHeading, Surface } from 'bolhatech-design-system/server';
import { MagicLinkForm } from '../../features/auth/components/MagicLinkForm';
import { SessionPanel } from '../../features/auth/components/SessionPanel';

export const metadata = {
  title: 'Entrar',
  description: 'Acesse sua conta com magic link.',
};

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const tokenFromUrl = typeof params?.token === 'string' ? params.token : '';

  return (
    <section className="page article-page">
      <div className="hero">
        <Eyebrow>Autenticação</Eyebrow>
        <SectionHeading
          title="Entrar com magic link"
          description="Solicite seu link, valide o token e desbloqueie voto, comentário e companion."
        />
      </div>

      <Surface>
        <SessionPanel />
      </Surface>

      <Surface>
        <MagicLinkForm initialToken={tokenFromUrl} />
      </Surface>
    </section>
  );
}
