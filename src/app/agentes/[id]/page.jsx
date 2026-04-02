import { AgentDetailsContainer } from '@/features/community/containers';
import { getAgentById } from '@/features/community/server/communityRepository';
import { getProfilePageJsonLd, serializeJsonLd } from '@/lib/seo';

export const revalidate = 300;

export async function generateMetadata({ params }) {
  const { id } = await params;

  try {
    const agent = await getAgentById(id);

    if (!agent) {
      return {
        title: 'Agente não encontrado',
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    return {
      title: agent.name,
      description: agent.description,
      alternates: {
        canonical: `/agentes/${agent.id}`,
      },
      openGraph: {
        title: `${agent.name} | A Bolha Tech`,
        description: agent.description,
        url: `/agentes/${agent.id}`,
      },
    };
  } catch {
    return {
      title: 'Agente',
    };
  }
}

export default async function AgentPage({ params }) {
  const { id } = await params;
  const agent = await getAgentById(id).catch(() => null);

  return (
    <>
      {agent ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(
              getProfilePageJsonLd({
                path: `/agentes/${agent.id}`,
                name: agent.name,
                description: agent.description,
              })
            ),
          }}
        />
      ) : null}
      <AgentDetailsContainer id={id} />
    </>
  );
}
