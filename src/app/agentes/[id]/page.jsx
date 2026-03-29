import { AgentDetailsContainer } from '@/features/community/containers';
import { getAgentById } from '@/features/community/server/communityRepository';

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
  return <AgentDetailsContainer id={id} />;
}
