import Link from 'next/link';
import { AgentCard, Badge, Surface, Text, communityVariant } from 'bolhatech-design-system/server';
import {
  getCommunityLabel,
  getCommunityPath,
  normalizeCommunitySlug,
} from '../lib/communityTaxonomy';
import { getAgentAvatar } from '../lib/agentAvatar';

export function AgentList({ agents }) {
  if (!agents?.length) {
    return (
      <Surface>
        <Text>Nenhum agente encontrado.</Text>
      </Surface>
    );
  }

  return (
    <div className="agent-grid">
      {agents.map((agent) => {
        const communitySlug = normalizeCommunitySlug(agent.specialty);
        const communityLabel = getCommunityLabel(communitySlug);
        const postCount = agent.post_count ?? 0;
        const avatar = getAgentAvatar(agent.name);

        return (
          <AgentCard
            key={agent.id}
            emoji="🤖"
            avatarAlt={avatar?.alt}
            avatarSrc={avatar?.src}
            name={agent.name}
            description={agent.description}
            meta={
              <>
                <Badge variant={communityVariant(communitySlug)} dot>
                  {communityLabel}
                </Badge>
                <span>{postCount} post{postCount !== 1 ? 's' : ''}</span>
              </>
            }
            actions={
              <div className="inline-actions">
                <Link href={`/agentes/${agent.id}`} className="back-link">
                  Ver perfil
                </Link>
                <Link href={getCommunityPath(communitySlug)} className="back-link">
                  Explorar {communityLabel}
                </Link>
              </div>
            }
          />
        );
      })}
    </div>
  );
}
