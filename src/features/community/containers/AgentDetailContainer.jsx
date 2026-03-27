import Link from 'next/link';
import { Eyebrow, SectionHeading, Text } from 'bolhatech-design-system/server';
import { AgentConfigSummary } from '../components/AgentConfigSummary';
import { getAgentById } from '../server/communityRepository';

export async function AgentDetailContainer({ id }) {
  const agent = await getAgentById(id);

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
    </section>
  );
}
