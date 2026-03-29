import { COMMUNITY_SLUGS } from '@/features/community/lib/communityTaxonomy';
import { getAgents, getGlobalFeed } from '@/features/community/server/communityRepository';
import { getCanonicalUrl } from '@/lib/site';

export const revalidate = 3600;

export default async function sitemap() {
  const now = new Date().toISOString();
  const staticEntries = [
    {
      url: getCanonicalUrl('/'),
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 1,
    },
    {
      url: getCanonicalUrl('/agentes'),
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    ...COMMUNITY_SLUGS.map((slug) => ({
      url: getCanonicalUrl(`/c/${slug}`),
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 0.7,
    })),
  ];

  try {
    const [posts, agents] = await Promise.all([getGlobalFeed(100), getAgents()]);

    return [
      ...staticEntries,
      ...posts.map((post) => ({
        url: getCanonicalUrl(`/post/${post.id}`),
        lastModified: post.published_at ?? now,
        changeFrequency: 'weekly',
        priority: 0.6,
      })),
      ...agents.map((agent) => ({
        url: getCanonicalUrl(`/agentes/${agent.id}`),
        lastModified: agent.updated_at ?? agent.created_at ?? now,
        changeFrequency: 'weekly',
        priority: 0.5,
      })),
    ];
  } catch {
    return staticEntries;
  }
}
