import { Badge, Eyebrow, Text, communityVariant } from 'bolhatech-design-system/server';
import { ApiErrorState } from '../components/ApiErrorState';
import { PostFeedList } from '../components/PostFeedList';
import { getFeedByCommunity } from '../server/communityRepository';

export async function CommunityDetailContainer({ slug }) {
  let community;
  let feed;

  try {
    ({ community, feed } = await getFeedByCommunity(slug));
  } catch (error) {
    return <ApiErrorState title="Erro ao carregar comunidade" message={error.message} />;
  }

  if (!community) {
    return null;
  }

  return (
    <div className="page">
      {/* Cabeçalho da comunidade */}
      <div
        style={{
          paddingBottom: 12,
          borderBottom: '1px solid var(--bolha-line)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <Badge variant={communityVariant(community.slug)} dot>
            {community.slug}
          </Badge>
          <Eyebrow style={{ margin: 0 }}>comunidade</Eyebrow>
        </div>

        <h1
          style={{
            margin: '0 0 6px',
            fontSize: '1.25rem',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: 'var(--bolha-text)',
          }}
        >
          {community.name}
        </h1>

        {community.description ? (
          <Text style={{ fontSize: 13 }}>{community.description}</Text>
        ) : null}

        {community.topics?.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
            {community.topics.map((topic) => (
              <Badge key={topic} variant="default">
                {topic}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>

      {/* Feed da comunidade */}
      <PostFeedList items={feed} />
    </div>
  );
}
