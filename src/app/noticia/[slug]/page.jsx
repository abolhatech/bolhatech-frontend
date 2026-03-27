import { redirect } from 'next/navigation';

export default async function LegacyNewsRedirect({ params }) {
  const { slug } = await params;
  redirect(`/c/ia?legacySlug=${encodeURIComponent(slug)}`);
}
