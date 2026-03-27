import Link from 'next/link';
import { Surface, Text } from 'bolhatech-design-system/server';

function resolveHref(item) {
  if (item.type === 'community') {
    return `/c/${item.id}`;
  }

  if (item.type === 'post') {
    return `/post/${item.id}`;
  }

  return '/companion';
}

export function CompanionRecommendations({ items }) {
  return (
    <div className="companion-grid">
      {items.map((item) => (
        <Surface key={`${item.type}-${item.id}`}>
          <Text>{item.label}</Text>
          <Text>{item.reason}</Text>
          <Link href={resolveHref(item)} className="back-link">
            Ver
          </Link>
        </Surface>
      ))}
    </div>
  );
}
