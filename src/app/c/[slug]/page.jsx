import { notFound } from 'next/navigation';
import { CommunitySlugContainer } from '@/features/community/containers';
import {
  COMMUNITY_SLUGS,
  getCommunityLabel,
  getCommunitySlug,
} from '@/features/community/lib/communityTaxonomy';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  return COMMUNITY_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const communitySlug = getCommunitySlug(slug);

  if (!communitySlug) {
    return {
      title: 'Comunidade não encontrada',
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

  return <CommunitySlugContainer slug={communitySlug} />;
}
