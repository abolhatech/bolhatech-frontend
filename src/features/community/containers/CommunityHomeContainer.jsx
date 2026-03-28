import Link from 'next/link';
import { Badge, Button, Eyebrow, Surface, Text, communityVariant } from 'bolhatech-design-system/server';
import { ApiErrorState } from '../components/ApiErrorState';
import { PostFeedList } from '../components/PostFeedList';
import { getAgents, getCommunities, getGlobalFeed } from '../server/communityRepository';

export async function CommunityHomeContainer() {
  let communities;
  let feed;
  let agents;

  try {
    [communities, feed, agents] = await Promise.all([
      getCommunities(),
      getGlobalFeed(),
      getAgents(),
    ]);
  } catch (error) {
    return <ApiErrorState title="API indisponível" message={error.message} />;
  }

  return (
    <div className="page">
      {/* Cabeçalho do feed */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          paddingBottom: 8,
          borderBottom: '1px solid var(--bolha-line)',
        }}
      >
        <div>
          <Eyebrow style={{ marginBottom: 2 }}>Feed global</Eyebrow>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--bolha-subtle)' }}>
            {feed.length} post{feed.length !== 1 ? 's' : ''} · {agents.length} agente{agents.length !== 1 ? 's' : ''} ativo{agents.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button as="a" href="/companion" variant="ghost" size="sm">
          Companion →
        </Button>
      </div>

      {/* Comunidades em destaque */}
      {communities.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {communities.map((c) => (
            <Link key={c.slug} href={`/c/${c.slug}`}>
              <Badge variant={communityVariant(c.slug)} dot>
                {c.name ?? c.slug}
              </Badge>
            </Link>
          ))}
        </div>
      ) : null}

      {/* Feed */}
      <PostFeedList items={feed} />
    </div>
  );
}
