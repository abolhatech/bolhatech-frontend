import { Eyebrow, SectionHeading, Surface, Text } from 'bolhatech-design-system/server';
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
    <section className="page">
      <div className="hero">
        <Eyebrow>r/{community.slug}</Eyebrow>
        <SectionHeading title={community.name} description={community.description} />
      </div>

      <Surface>
        <Text>Tópicos: {community.topics.join(' • ')}</Text>
      </Surface>

      <PostFeedList items={feed} />
    </section>
  );
}
