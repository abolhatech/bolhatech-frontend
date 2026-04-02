const DEFAULT_TIMEZONE = 'America/Sao_Paulo';
const DEFAULT_CLASSIFIER_MODEL = 'gpt-5.4-mini';
const DEFAULT_WRITER_MODEL = 'gpt-5.4-mini';
const DEFAULT_FEEDS = [
  {
    name: 'TechCrunch',
    source: 'techcrunch',
    url: 'https://techcrunch.com/feed/',
    categories: ['startups', 'produtos', 'mercado'],
  },
  {
    name: 'The Verge',
    source: 'the-verge',
    url: 'https://www.theverge.com/rss/index.xml',
    categories: ['consumer-tech', 'plataformas', 'internet'],
  },
  {
    name: 'Ars Technica',
    source: 'ars-technica',
    url: 'https://feeds.arstechnica.com/arstechnica/index',
    categories: ['analysis', 'science', 'policy'],
  },
  {
    name: 'Hacker News',
    source: 'hacker-news',
    url: 'https://hnrss.org/frontpage',
    categories: ['developers', 'infra', 'ai'],
  },
];

export const MARGARET_AGENT_ID = '00000000-0000-0000-0000-000000000003';

export function getNewsDigestConfig() {
  return {
    timezone: process.env.NEWS_DIGEST_TIMEZONE || DEFAULT_TIMEZONE,
    classifierModel:
      process.env.NEWS_DIGEST_CLASSIFIER_MODEL || DEFAULT_CLASSIFIER_MODEL,
    writerModel: process.env.NEWS_DIGEST_WRITER_MODEL || DEFAULT_WRITER_MODEL,
    openAiApiKey: process.env.OPENAI_API_KEY || null,
    shortlistSize: parseIntegerEnv(process.env.NEWS_DIGEST_SHORTLIST_SIZE, 12),
    maxSelectedItems: parseIntegerEnv(process.env.NEWS_DIGEST_MAX_SELECTED_ITEMS, 5),
    maxItemsPerFeed: parseIntegerEnv(process.env.NEWS_DIGEST_MAX_ITEMS_PER_FEED, 12),
    lookbackHours: parseIntegerEnv(process.env.NEWS_DIGEST_LOOKBACK_HOURS, 36),
    feeds: parseFeeds(process.env.NEWS_DIGEST_RSS_FEEDS),
  };
}

function parseFeeds(rawValue) {
  if (!rawValue?.trim()) {
    return DEFAULT_FEEDS;
  }

  try {
    const parsed = JSON.parse(rawValue);

    if (
      Array.isArray(parsed) &&
      parsed.every(
        (feed) =>
          typeof feed?.name === 'string' &&
          typeof feed?.source === 'string' &&
          typeof feed?.url === 'string'
      )
    ) {
      return parsed.map((feed) => ({
        name: feed.name,
        source: feed.source,
        url: feed.url,
        categories: Array.isArray(feed.categories) ? feed.categories : [],
      }));
    }
  } catch (error) {
    console.warn('[news-digest] NEWS_DIGEST_RSS_FEEDS inválido; usando feeds padrão.', error);
  }

  return DEFAULT_FEEDS;
}

function parseIntegerEnv(value, fallback) {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}
