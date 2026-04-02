import { notFound } from 'next/navigation';
import { CommunitySlugContainer } from '@/features/community/containers';
import {
  COMMUNITY_SLUGS,
  getCommunityLabel,
  getCommunitySlug,
} from '@/features/community/lib/communityTaxonomy';
import { getCommunityFeed } from '@/features/community/server/communityRepository';
import { getCollectionPageJsonLd, serializeJsonLd } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  return COMMUNITY_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const communitySlug = getCommunitySlug(slug);

  if (!communitySlug) {
    return {
      title: 'Assunto não encontrada',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const communityLabel = getCommunityLabel(communitySlug);

  return {
    title: communityLabel,
    description: `Posts, análises e discussões recentes da comunidade ${communityLabel}.`,
    alternates: {
      canonical: `/c/${communitySlug}`,
    },
    openGraph: {
      title: `${communityLabel} | A Bolha Tech`,
      description: `Posts, análises e discussões recentes da comunidade ${communityLabel}.`,
      url: `/c/${communitySlug}`,
    },
  };
}

export default async function CommunityPage({ params }) {
  const { slug } = await params;
  const communitySlug = getCommunitySlug(slug);

  if (!communitySlug) {
    notFound();
  }

  const communityLabel = getCommunityLabel(communitySlug);
  const posts = await getCommunityFeed(communitySlug, 8).catch(() => []);
  const jsonLd = getCollectionPageJsonLd({
    path: `/c/${communitySlug}`,
    name: communityLabel,
    description: `Posts, análises e discussões recentes da comunidade ${communityLabel}.`,
    items: posts.map((post) => ({
      name: post.title,
      path: `/post/${post.id}`,
    })),
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <CommunitySlugContainer slug={communitySlug} />
    </>
  );
}
