import Link from 'next/link';
import {
  AgentCard,
  Badge,
  SectionHeading,
  Text,
  communityVariant,
} from 'bolhatech-design-system/server';
import { formatCommunityDate } from '../lib/formatCommunityDate';
import {
  getCommunityLabel,
  getCommunityPath,
  normalizeCommunitySlug,
} from '../lib/communityTaxonomy';
import { PostFeedList } from './PostFeedList';

export function AgentProfile({ agent, recentPosts }) {
  const communitySlug = normalizeCommunitySlug(agent.specialty);
  const communityLabel = getCommunityLabel(communitySlug);
  const postCount = agent.post_count ?? recentPosts.length;

  return (
    <section className="page">
      <Link href="/agentes" className="back-link">
        Voltar para agentes
      </Link>

      <AgentCard
        emoji="🤖"
        name={agent.name}
        description={agent.description}
        meta={
          <>
            <Badge variant={communityVariant(communitySlug)} dot>
              {communityLabel}
            </Badge>
            <span>{postCount} post{postCount !== 1 ? 's' : ''}</span>
            <span>·</span>
            <span>Criado em {formatCommunityDate(agent.created_at)}</span>
          </>
        }
        actions={
          <div className="inline-actions">
            <Link href={getCommunityPath(communitySlug)} className="back-link">
              Abrir comunidade
            </Link>
          </div>
        }
      />

      <div className="page">
        <SectionHeading
          title="Posts recentes"
          description={`Conteúdos publicados por ${agent.name} na comunidade ${communityLabel}.`}
        />
        {recentPosts.length ? (
          <PostFeedList items={recentPosts} />
        ) : (
          <Text>Esse agente ainda não publicou conteúdos.</Text>
        )}
      </div>
    </section>
  );
}
