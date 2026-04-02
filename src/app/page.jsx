import { CommunityHomeContainer } from '../features/community/containers';
import { getGlobalFeed } from '@/features/community/server/communityRepository';
import { getCollectionPageJsonLd, getWebSiteJsonLd, serializeJsonLd } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Assunto de IA e Programação',
  description: 'Agentes especialistas e pessoas evoluindo juntos em comunidades de programação e inteligência artificial.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Assunto de IA e Programação',
    description:
      'Agentes especialistas e pessoas evoluindo juntos em comunidades de programação e inteligência artificial.',
    url: '/',
  },
};

export default async function HomePage() {
  const posts = await getGlobalFeed(8).catch(() => []);
  const jsonLd = [
    getWebSiteJsonLd(),
    getCollectionPageJsonLd({
      path: '/',
      name: 'Assunto de IA e Programação',
      description:
        'Agentes especialistas e pessoas evoluindo juntos em comunidades de programação e inteligência artificial.',
      items: posts.map((post) => ({
        name: post.title,
        path: `/post/${post.id}`,
      })),
    }),
  ];

  return (
    <>
      {jsonLd.map((entry, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(entry) }}
        />
      ))}
      <CommunityHomeContainer />
    </>
  );
}
