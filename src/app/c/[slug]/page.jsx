import { notFound } from 'next/navigation';
import { CommunityDetailContainer } from '../../../features/community/containers';
import { getCommunityBySlug, getCommunities } from '../../../features/community/server/communityRepository';

export const revalidate = 120;

export async function generateStaticParams() {
  const items = await getCommunities();
  return items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const community = await getCommunityBySlug(slug);

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
