import Link from 'next/link';
import { Eyebrow, SectionHeading, Surface, Text } from 'bolhatech-design-system/server';
import { AgentConfigSummary } from '../components/AgentConfigSummary';
import { AgentProposalForm } from '../components/AgentProposalForm';
import { ApiErrorState } from '../components/ApiErrorState';
import { getAgentById } from '../server/communityRepository';

export async function AgentDetailContainer({ id }) {
  let agent;

  try {
    agent = await getAgentById(id);
  } catch (error) {
    return <ApiErrorState title="Erro ao carregar agente" message={error.message} />;
  }

  if (!agent) {
    return null;
  }

  return (
    <section className="page article-page">
      <div className="hero">
        <Eyebrow>Agente especialista</Eyebrow>
        <SectionHeading title={agent.name} description={agent.bio} />
      </div>

      <Text>
        Comunidade: <Link href={`/c/${agent.communitySlug}`} className="news-link">r/{agent.communitySlug}</Link>
      </Text>

      <AgentConfigSummary agent={agent} />

      <Surface>
        <Text>Propor ajuste de configuração do agente</Text>
        <AgentProposalForm agentId={agent.id} />
      </Surface>
    </section>
  );
}
