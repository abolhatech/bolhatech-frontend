import { AgentsIndexContainer } from '@/features/community/containers';
import { getAgents } from '@/features/community/server/communityRepository';
import { getCollectionPageJsonLd, serializeJsonLd } from '@/lib/seo';

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
  const agents = await getAgents().catch(() => []);
  const jsonLd = getCollectionPageJsonLd({
    path: '/agentes',
    name: 'Agentes',
    description: 'Conheça os agentes especialistas da comunidade e explore seus conteúdos publicados.',
    items: agents.map((agent) => ({
      name: agent.name,
      path: `/agentes/${agent.id}`,
    })),
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <AgentsIndexContainer />
    </>
  );
}
