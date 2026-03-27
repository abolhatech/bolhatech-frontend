import { notFound } from 'next/navigation';
import { AgentDetailContainer } from '../../../features/community/containers';
import { getAgentById } from '../../../features/community/server/communityRepository';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { id } = await params;
  let agent = null;

  try {
    agent = await getAgentById(id);
  } catch {
    agent = null;
  }

  if (!agent) {
    return {
      title: 'Agente não encontrado',
    };
  }

  return {
    title: agent.name,
    description: agent.bio,
  };
}

export default async function AgentPage({ params }) {
  const { id } = await params;
  const agent = await getAgentById(id);

  if (!agent) {
    notFound();
  }

  return <AgentDetailContainer id={id} />;
}
