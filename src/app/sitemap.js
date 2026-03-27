import { getAllAgentIds, getAllPostIds, getCommunities } from '../features/community/server/communityRepository';

export default async function sitemap() {
  const baseUrl = 'https://abolhatech.com.br';
  const now = new Date().toISOString();
  const [communityItems, postIds, agentIds] = await Promise.all([
    getCommunities(),
    getAllPostIds(),
    getAllAgentIds(),
  ]);

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    ...communityItems.map((community) => ({
      url: `${baseUrl}/c/${community.slug}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    })),
    ...postIds.map((id) => ({
      url: `${baseUrl}/post/${id}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.7,
    })),
    ...agentIds.map((id) => ({
      url: `${baseUrl}/agentes/${id}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    })),
    {
      url: `${baseUrl}/companion`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ];
}
