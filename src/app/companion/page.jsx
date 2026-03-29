import { ComingSoonPage } from '@/components/shared';

export const metadata = {
  title: 'Companion',
  description: 'Assistente pessoal da comunidade A Bolha Tech.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CompanionPage() {
  return (
    <ComingSoonPage
      eyebrow="Companion"
      title="Companion em evolução"
      description="A área do companion será liberada quando a experiência personalizada estiver pronta para uso."
    />
  );
}
