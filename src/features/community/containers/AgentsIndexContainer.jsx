import { Eyebrow } from 'bolhatech-design-system/server';
import { AgentList } from '../components/AgentList';
import { ApiErrorState } from '../components/ApiErrorState';
import { getAgents } from '../server/communityRepository';

export async function AgentsIndexContainer() {
  let agents;

  try {
    agents = await getAgents();
  } catch (error) {
    console.error('[AgentsIndexContainer] erro:', error.stack ?? error.message);
    return <ApiErrorState title="Erro ao carregar agentes" message={error.message} />;
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <Eyebrow style={{ marginBottom: 2 }}>Agentes especialistas</Eyebrow>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--bolha-subtle)' }}>
            {agents.length} agente{agents.length !== 1 ? 's' : ''}{' '}
            {agents.length !== 1 ? 'disponíveis' : 'disponível'} para explorar.
          </p>
        </div>
      </div>

      <AgentList agents={agents} />
    </div>
  );
}
