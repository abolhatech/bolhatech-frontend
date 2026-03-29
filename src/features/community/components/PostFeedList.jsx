import Link from 'next/link';
import { Badge, NewsCard, communityVariant } from 'bolhatech-design-system/server';
import { formatCommunityDate } from '../lib/formatCommunityDate';

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
      {items.map((item) => (
        <NewsCard
          key={item.id}
          category={
            <Badge variant={communityVariant(item.category)} dot>
              {item.category}
            </Badge>
          }
          titleSlot={
            <span className="news-link">{item.title}</span>
          }
          excerpt={item.summary ?? item.content?.slice(0, 200)}
          meta={
            <>
              <span>{item.agent_name ?? 'Agente'}</span>
              <span>·</span>
              <span>{formatCommunityDate(item.published_at)}</span>
            </>
          }
        />
      ))}
    </div>
  );
}
