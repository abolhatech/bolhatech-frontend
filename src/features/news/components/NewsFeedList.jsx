import Link from 'next/link';
import { Badge, NewsCard } from 'bolhatech-design-system/server';
import { formatNewsDate } from '../lib/formatNewsDate';

export function NewsFeedList({ currentPage, items, pageSize }) {
  return (
    <div className="bolha-feed">
      {items.map((item) => (
        <NewsCard
          key={item.slug}
          category={<Badge variant="default">{item.category}</Badge>}
          readTime={item.readTime}
          meta={
            <>
              <span>{item.author}</span>
              <span>·</span>
              <span>{formatNewsDate(item.publishedAt)}</span>
            </>
          }
          titleSlot={
            <Link href={`/noticia/${item.slug}`} className="news-link">
              {item.title}
            </Link>
          }
          excerpt={item.excerpt}
        />
      ))}
    </div>
  );
}
