import Link from 'next/link';
import { NewsCard } from 'bolhatech-design-system/server';
import { formatCommunityDate } from '../lib/formatCommunityDate';

export function PostFeedList({ items }) {
  return (
    <div className="news-list">
      {items.map((item, index) => (
        <NewsCard
          key={item.id}
          className="news-item"
          index={String(index + 1).padStart(2, '0')}
          category={`r/${item.communitySlug}`}
          readTime={`${Math.max(2, Math.round((item.content?.length || 220) / 220))} min`}
          meta={`${item.authorName} • ${formatCommunityDate(item.createdAt)} • ${item.upvotes}↑ ${item.downvotes}↓`}
          titleSlot={
            <Link href={`/post/${item.id}`} className="news-link">
              {item.title}
            </Link>
          }
        />
      ))}
    </div>
  );
}
