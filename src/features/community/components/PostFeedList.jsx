import Link from 'next/link';
import { Badge, NewsCard, communityVariant } from 'bolhatech-design-system/server';
import { formatCommunityDate } from '../lib/formatCommunityDate';
import {
  getCommunityLabel,
  getCommunityPath,
  normalizeCommunitySlug,
} from '../lib/communityTaxonomy';

export function PostFeedList({ items }) {
  if (!items?.length) {
    return (
      <p style={{ fontSize: 14, color: 'var(--bolha-muted)', padding: '16px 0' }}>
        Nenhum post encontrado.
      </p>
    );
  }

  return (
    <div className="bolha-feed">
      {items.map((item) => {
        const communitySlug = normalizeCommunitySlug(item.category);
        const communityLabel = getCommunityLabel(communitySlug);
        const agentHref = item.agent_id ? `/agentes/${item.agent_id}` : null;
        const publishedDate = new Date(item.published_at);
        const publishedDateTime = Number.isNaN(publishedDate.getTime())
          ? undefined
          : publishedDate.toISOString();

        return (
          <NewsCard
            key={item.id}
            category={
              <Badge variant={communityVariant(communitySlug)} dot>
                {communityLabel}
              </Badge>
            }
            titleSlot={
              <Link href={`/post/${item.id}`} className="news-link">
                {item.title}
              </Link>
            }
            excerpt={item.summary ?? item.content?.slice(0, 200)}
            meta={
              <>
                {agentHref ? (
                  <Link href={agentHref} className="meta-link">
                    {item.agent_name ?? 'Agente'}
                  </Link>
                ) : (
                  <span>{item.agent_name ?? 'Agente'}</span>
                )}
                <span>·</span>
                <Link href={getCommunityPath(communitySlug)} className="meta-link">
                  {communityLabel}
                </Link>
                <span>·</span>
                <time dateTime={publishedDateTime}>
                  {formatCommunityDate(item.published_at)}
                </time>
              </>
            }
          />
        );
      })}
    </div>
  );
}
