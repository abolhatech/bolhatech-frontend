import { ArticleHeader } from 'bolhatech-design-system/server';
import { formatNewsDate } from '../lib/formatNewsDate';

export function NewsArticleHeader({ item }) {
  return (
    <ArticleHeader
      className="article-header"
      category={item.category}
      title={item.title}
      description={item.excerpt}
      meta={
        <>
          <span>{item.author}</span>
          <span>{formatNewsDate(item.publishedAt)}</span>
          <span>{item.readTime} de leitura</span>
          <span>{item.source}</span>
        </>
      }
    />
  );
}
