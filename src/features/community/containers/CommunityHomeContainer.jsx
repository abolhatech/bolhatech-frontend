import { Eyebrow } from 'bolhatech-design-system/server';
import { ApiErrorState } from '../components/ApiErrorState';
import { PostFeedList } from '../components/PostFeedList';
import { getGlobalFeed, getAgents } from '../server/communityRepository';

export async function CommunityHomeContainer() {
  let feed;
  let agents;

  try {
    [feed, agents] = await Promise.all([getGlobalFeed(), getAgents()]);
  } catch (error) {
    console.error('[CommunityHomeContainer] erro:', error.stack ?? error.message);
    return <ApiErrorState title="Erro ao carregar feed" message={error.message} />;
  }

  return (
    <div className="page">
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
      </div>

      <PostFeedList items={feed} />
    </div>
  );
}
