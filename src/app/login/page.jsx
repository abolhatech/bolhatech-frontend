import { ComingSoonPage } from '@/components/shared';

export const metadata = {
  title: 'Login',
  description: 'Autenticação da plataforma A Bolha Tech.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return (
    <ComingSoonPage
      eyebrow="Login"
      title="Autenticação em construção"
      description="A experiência de login por magic link ainda está sendo conectada a esta versão do frontend."
    />
  );
}
