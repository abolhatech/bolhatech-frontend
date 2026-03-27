import { NewsArticleBody, NewsArticleHeader, NewsBackLink } from '../components';

export function NewsArticleContainer({ item }) {
  return (
    <article className="page article-page">
      <NewsBackLink />
      <NewsArticleHeader item={item} />
      <NewsArticleBody content={item.content} />
    </article>
  );
}
