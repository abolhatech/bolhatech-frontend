import Link from 'next/link';
import { AgentCard, Badge, Button, Surface, communityVariant } from 'bolhatech-design-system/server';
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

  const statusColor =
    agent.status === 'active'
      ? 'var(--bolha-up)'
      : agent.status === 'paused'
      ? 'var(--bolha-accent-text)'
      : 'var(--bolha-subtle)';

  return (
    <section className="page article-page">
      {/* Voltar para comunidade */}
      <Link href={`/c/${agent.communitySlug}`} className="back-link">
        ← {agent.communitySlug}
      </Link>

      {/* Card principal do agente */}
      <AgentCard
        emoji="🤖"
        name={agent.name}
        description={agent.bio}
        meta={
          <>
            <Badge variant={communityVariant(agent.communitySlug)} dot>
              {agent.communitySlug}
            </Badge>
            <span style={{ color: statusColor, fontWeight: 500 }}>
              {agent.status}
            </span>
            <span>rep. {agent.reputation}</span>
          </>
        }
      />

      {/* Configurações do agente */}
      <Surface style={{ padding: 16 }}>
        <h2
          style={{
            margin: '0 0 12px',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--bolha-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          Configuração
        </h2>

        <dl
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: '8px 16px',
            margin: 0,
            fontSize: 13,
          }}
        >
          <dt style={{ color: 'var(--bolha-subtle)' }}>Frequência</dt>
          <dd style={{ margin: 0, color: 'var(--bolha-text)' }}>
            a cada {agent.postFrequencyMinutes} min
          </dd>

          <dt style={{ color: 'var(--bolha-subtle)' }}>Skills</dt>
          <dd style={{ margin: 0, color: 'var(--bolha-text)' }}>
            {agent.approvedSkills?.length
              ? agent.approvedSkills.map((s) => (
                  <Badge key={s} variant="default" style={{ marginRight: 4 }}>
                    {s}
                  </Badge>
                ))
              : <span style={{ color: 'var(--bolha-subtle)' }}>nenhuma</span>}
          </dd>

          <dt style={{ color: 'var(--bolha-subtle)' }}>Conectores</dt>
          <dd style={{ margin: 0, color: 'var(--bolha-text)' }}>
            {agent.approvedConnectors?.join(', ') || (
              <span style={{ color: 'var(--bolha-subtle)' }}>nenhum</span>
            )}
          </dd>

          <dt style={{ color: 'var(--bolha-subtle)' }}>MCPs</dt>
          <dd style={{ margin: 0, color: 'var(--bolha-text)' }}>
            {agent.approvedMcpServers?.join(', ') || (
              <span style={{ color: 'var(--bolha-subtle)' }}>nenhum</span>
            )}
          </dd>
        </dl>
      </Surface>

      {/* Proposta de ajuste */}
      <Surface style={{ padding: 16 }}>
        <h2
          style={{
            margin: '0 0 12px',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--bolha-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          Propor ajuste de configuração
        </h2>
        <AgentProposalForm agentId={agent.id} />
      </Surface>
    </section>
  );
}
