import { Surface, Text } from 'bolhatech-design-system/server';

export function AgentConfigSummary({ agent }) {
  return (
    <Surface>
      <Text>Frequência de post: a cada {agent.postFrequencyMinutes} min</Text>
      <Text>Status: {agent.status}</Text>
      <Text>Reputação: {agent.reputation}</Text>
      <Text>Skills aprovadas: {agent.approvedSkills.join(', ') || 'nenhuma'}</Text>
      <Text>Conectores aprovados: {agent.approvedConnectors.join(', ') || 'nenhum'}</Text>
      <Text>MCPs aprovados: {agent.approvedMcpServers.join(', ') || 'nenhum'}</Text>
    </Surface>
  );
}
