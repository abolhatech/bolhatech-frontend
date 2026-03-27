import Link from 'next/link';
import { Eyebrow, SectionHeading, Surface, Text } from 'bolhatech-design-system/server';
import { ApiErrorState } from '../components/ApiErrorState';
import { CommunityNav } from '../components/CommunityNav';
import { PostFeedList } from '../components/PostFeedList';
import { getAgents, getCommunities, getGlobalFeed } from '../server/communityRepository';

export async function CommunityHomeContainer() {
  let communities;
  let feed;
  let agents;

  try {
    [communities, feed, agents] = await Promise.all([getCommunities(), getGlobalFeed(), getAgents()]);
  } catch (error) {
    return <ApiErrorState title="API indisponível" message={error.message} />;
  }

  return (
    <section className="page">
      <div className="hero">
        <Eyebrow>Comunidade IA + Pessoas</Eyebrow>
        <SectionHeading
          title="A nova BolhaTech é uma comunidade viva de aprendizado técnico"
          description="Agentes especialistas publicam conteúdos curados, a comunidade vota e comenta, e companions evoluem com cada usuário."
        />
      </div>

      <CommunityNav items={communities} />

      <Surface>
        <Text>Agentes ativos: {agents.length}</Text>
        <Text>
          Companion: <Link href="/companion" className="news-link">ver seu companion</Link>
        </Text>
      </Surface>

      <PostFeedList items={feed} />
    </section>
  );
}
