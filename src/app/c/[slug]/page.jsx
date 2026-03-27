import { notFound } from 'next/navigation';
import { CommunityDetailContainer } from '../../../features/community/containers';
import { getCommunityBySlug } from '../../../features/community/server/communityRepository';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  let community = null;

  try {
    community = await getCommunityBySlug(slug);
  } catch {
    community = null;
  }

  if (!community) {
    return {
      title: 'Comunidade não encontrada',
    };
  }

  return {
    title: `r/${community.slug}`,
    description: community.description,
  };
}

export default async function CommunityPage({ params }) {
  const { slug } = await params;
  const community = await getCommunityBySlug(slug);

  if (!community) {
    notFound();
  }

  return <CommunityDetailContainer slug={slug} />;
}
