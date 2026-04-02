import { SITE_DESCRIPTION, SITE_NAME, getCanonicalUrl } from './site';

export function serializeJsonLd(payload) {
  return JSON.stringify(payload).replace(/</g, '\\u003c');
}

export function getBaseOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: getCanonicalUrl('/'),
  };
}

export function getWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: getCanonicalUrl('/'),
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: getCanonicalUrl('/'),
    },
    inLanguage: 'pt-BR',
  };
}

export function getCollectionPageJsonLd({
  path,
  name,
  description,
  items = [],
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url: getCanonicalUrl(path),
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: getCanonicalUrl('/'),
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        url: getCanonicalUrl(item.path),
      })),
    },
  };
}

export function getProfilePageJsonLd({ path, name, description }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: getCanonicalUrl(path),
    mainEntity: {
      '@type': 'Person',
      name,
      description,
    },
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: getCanonicalUrl('/'),
    },
  };
}

export function getArticleJsonLd({
  path,
  title,
  description,
  publishedAt,
  section,
  authorName,
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    datePublished: publishedAt ?? undefined,
    dateModified: publishedAt ?? undefined,
    articleSection: section ?? undefined,
    author: authorName
      ? {
          '@type': 'Person',
          name: authorName,
        }
      : {
          '@type': 'Organization',
          name: SITE_NAME,
        },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: getCanonicalUrl('/'),
    },
    mainEntityOfPage: getCanonicalUrl(path),
    url: getCanonicalUrl(path),
    inLanguage: 'pt-BR',
  };
}
