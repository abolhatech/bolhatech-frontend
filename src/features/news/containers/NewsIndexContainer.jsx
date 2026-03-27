import { NewsFeedHero, NewsFeedList, NewsPagination } from '../components';
import { getPaginatedNews } from '../server/newsRepository';

export function NewsIndexContainer({ page }) {
  const { items, page: safePage, totalPages } = getPaginatedNews(page);

  return (
    <section className="page">
      <NewsFeedHero />
      <NewsFeedList items={items} currentPage={safePage} pageSize={10} />
      <NewsPagination currentPage={safePage} totalPages={totalPages} />
    </section>
  );
}
