import Link from 'next/link';
import { NewsCard } from 'bolhatech-design-system/server';
import { formatNewsDate } from '../lib/formatNewsDate';

export function NewsFeedList({ currentPage, items, pageSize }) {
  return (
    <div className="news-list">
      {items.map((item, index) => (
        <NewsCard
          key={item.slug}
          className="news-item"
          index={String((currentPage - 1) * pageSize + index + 1).padStart(2, '0')}
          category={item.category}
          readTime={item.readTime}
          meta={`${item.author} • ${formatNewsDate(item.publishedAt)}`}
          titleSlot={
            <Link href={`/noticia/${item.slug}`} className="news-link">
              {item.title}
            </Link>
          }
        />
      ))}
    </div>
  );
}
