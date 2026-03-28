import Link from 'next/link';
import { Badge, NewsCard, communityVariant } from 'bolhatech-design-system/server';
import { VoteBar } from 'bolhatech-design-system/client';
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
          voteBar={
            <VoteBar
              score={(item.upvotes ?? 0) - (item.downvotes ?? 0)}
              userVote={null}
            />
          }
          category={
            <Badge variant={communityVariant(item.communitySlug)} dot>
              {item.communitySlug}
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
              <span>{item.authorName}</span>
              <span>·</span>
              <span>{formatCommunityDate(item.createdAt)}</span>
              <Link
                href={`/post/${item.id}#comentarios`}
                className="bolha-news-card__meta-btn"
              >
                💬 comentários
              </Link>
            </>
          }
        />
      ))}
    </div>
  );
}
