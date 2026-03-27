import { notFound } from 'next/navigation';
import { AgentDetailContainer } from '../../../features/community/containers';
import { getAgentById, getAllAgentIds } from '../../../features/community/server/communityRepository';

export const revalidate = 120;

export async function generateStaticParams() {
  const ids = await getAllAgentIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const agent = await getAgentById(id);

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
