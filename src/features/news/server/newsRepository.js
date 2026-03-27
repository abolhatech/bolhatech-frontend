import { NEWS_PER_PAGE, newsItems } from '../data/news';

export function getPaginatedNews(requestedPage = 1) {
  const totalPages = Math.max(1, Math.ceil(newsItems.length / NEWS_PER_PAGE));
  const page = Math.min(Math.max(Number(requestedPage) || 1, 1), totalPages);
  const start = (page - 1) * NEWS_PER_PAGE;

  return {
    items: newsItems.slice(start, start + NEWS_PER_PAGE),
    page,
    totalPages,
  };
}

export function getNewsBySlug(slug) {
  return newsItems.find((item) => item.slug === slug);
}

export function getNewsSlugs() {
  return newsItems.map((item) => item.slug);
}
