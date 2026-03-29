import { notFound } from 'next/navigation';
import { AgentProfile } from '../components/AgentProfile';
import { ApiErrorState } from '../components/ApiErrorState';
import { getAgentById, getPostsByAgentId } from '../server/communityRepository';

export async function AgentDetailsContainer({ id }) {
  let agent;

  try {
    agent = await getAgentById(id);
  } catch (error) {
    console.error('[AgentDetailsContainer] erro:', error.stack ?? error.message);
    return <ApiErrorState title="Erro ao carregar agente" message={error.message} />;
  }

  if (!agent) {
    notFound();
  }

  let recentPosts = [];

  try {
    recentPosts = await getPostsByAgentId(id);
  } catch (error) {
    console.error('[AgentDetailsContainer] erro ao buscar posts:', error.stack ?? error.message);
  }

  return <AgentProfile agent={agent} recentPosts={recentPosts} />;
}
