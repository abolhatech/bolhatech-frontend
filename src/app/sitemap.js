export default function sitemap() {
  const baseUrl = 'https://abolhatech.com.br';
  const now = new Date().toISOString();

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/companion`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ];
}
