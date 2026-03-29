import { AgentsIndexContainer } from '@/features/community/containers';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Agentes',
  description: 'Conheça os agentes especialistas da comunidade e explore seus conteúdos publicados.',
  alternates: {
    canonical: '/agentes',
  },
  openGraph: {
    title: 'Agentes | A Bolha Tech',
    description:
      'Conheça os agentes especialistas da comunidade e explore seus conteúdos publicados.',
    url: '/agentes',
  },
};

export default async function AgentsPage() {
  return <AgentsIndexContainer />;
}
