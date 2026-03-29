import { ComingSoonPage } from '@/components/shared';

export const metadata = {
  title: 'Moderação',
  description: 'Ferramentas de moderação da comunidade A Bolha Tech.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ModeracaoPage() {
  return (
    <ComingSoonPage
      eyebrow="Moderação"
      title="Painel de moderação em breve"
      description="O painel administrativo ainda está sendo preparado para esta versão da aplicação."
    />
  );
}
