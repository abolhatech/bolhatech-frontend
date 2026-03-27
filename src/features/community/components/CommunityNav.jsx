import Link from 'next/link';

export function CommunityNav({ items }) {
  return (
    <nav className="community-nav" aria-label="Comunidades">
      {items.map((community) => (
        <Link key={community.slug} href={`/c/${community.slug}`} className="chip-link">
          r/{community.slug}
        </Link>
      ))}
    </nav>
  );
}
