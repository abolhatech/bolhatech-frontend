function decodeXmlEntities(value) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

function stripHtml(value = '') {
  return decodeXmlEntities(value)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getTagValues(xml, tagName) {
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'gi');
  const values = [];
  let match = regex.exec(xml);

  while (match) {
    values.push(stripHtml(match[1]));
    match = regex.exec(xml);
  }

  return values;
}

function getFirstTagValue(xml, tagNames) {
  for (const tagName of tagNames) {
    const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i');
    const match = regex.exec(xml);

    if (match?.[1]) {
      return stripHtml(match[1]);
    }
  }

  return null;
}

function normalizeUrl(value) {
  if (!value) return null;

  try {
    return new URL(value).toString();
  } catch {
    return null;
  }
}

function normalizePublishedAt(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function extractItemXml(feedXml) {
  return [
    ...(feedXml.match(/<item\b[\s\S]*?<\/item>/gi) ?? []),
    ...(feedXml.match(/<entry\b[\s\S]*?<\/entry>/gi) ?? []),
  ];
}

function getAtomLink(itemXml) {
  const linkMatch = itemXml.match(/<link[^>]+href="([^"]+)"[^>]*\/?>/i);
  return linkMatch?.[1] ?? null;
}

function buildKeywords(item, feed) {
  const sourceText = `${item.title} ${item.summary} ${feed.categories.join(' ')}`.toLowerCase();
  const keywords = [
    'openai',
    'anthropic',
    'google',
    'gemini',
    'meta',
    'microsoft',
    'apple',
    'nvidia',
    'ai',
    'llm',
    'model',
    'launch',
    'pricing',
    'security',
    'funding',
    'browser',
    'cloud',
    'github',
    'vercel',
  ];

  return keywords.filter((keyword) => sourceText.includes(keyword));
}

function buildSummary(description, title) {
  const text = description || title;
  return text.length <= 280 ? text : `${text.slice(0, 277).trimEnd()}...`;
}

function parseFeedItems(feedXml, feed) {
  const itemXmlList = extractItemXml(feedXml);

  return itemXmlList
    .map((itemXml) => {
      const title = getFirstTagValue(itemXml, ['title']);
      const link = normalizeUrl(
        getFirstTagValue(itemXml, ['link']) || getAtomLink(itemXml)
      );
      const description =
        getFirstTagValue(itemXml, ['description', 'content:encoded', 'summary']) || '';
      const publishedAt = normalizePublishedAt(
        getFirstTagValue(itemXml, ['pubDate', 'published', 'updated', 'dc:date'])
      );
      const author =
        getFirstTagValue(itemXml, ['dc:creator', 'author', 'name']) || feed.name;

      if (!title || !link || !publishedAt) {
        return null;
      }

      const summary = buildSummary(description, title);

      return {
        id: link,
        title,
        url: link,
        summary,
        source: feed.source,
        sourceLabel: feed.name,
        author,
        publishedAt,
        categories: feed.categories,
        keywords: buildKeywords({ title, summary }, feed),
        rawText: `${title}\n${summary}`.trim(),
      };
    })
    .filter(Boolean);
}

export async function collectRssItems(config) {
  const results = await Promise.all(
    config.feeds.map(async (feed) => {
      const response = await fetch(feed.url, {
        headers: {
          Accept: 'application/rss+xml, application/xml, text/xml;q=0.9',
        },
        next: { revalidate: 0 },
      });

      if (!response.ok) {
        throw new Error(
          `Falha ao buscar feed ${feed.name} (${response.status} ${response.statusText}).`
        );
      }

      const xml = await response.text();
      return parseFeedItems(xml, feed).slice(0, config.maxItemsPerFeed);
    })
  );

  return results.flat();
}
