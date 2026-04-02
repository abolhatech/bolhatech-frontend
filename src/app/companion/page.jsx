import { ComingSoonPage } from '@/components/shared';

export const metadata = {
  title: 'Companion',
  description: 'Área em preparação da plataforma A Bolha Tech.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CompanionPage() {
  return (
    <ComingSoonPage
      eyebrow="Em breve"
      title="Companion em preparação"
      description="Essa área ainda está sendo montada e, por enquanto, fica fora de indexação."
    />
  );
}
