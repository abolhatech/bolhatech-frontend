import { Eyebrow } from 'bolhatech-design-system/server';
import { ApiErrorState } from '../components/ApiErrorState';
import { PostFeedList } from '../components/PostFeedList';
import {
  getCommunityLabel,
  normalizeCommunitySlug,
} from '../lib/communityTaxonomy';
import { getCommunityFeed } from '../server/communityRepository';

export async function CommunitySlugContainer({ slug }) {
  const communitySlug = normalizeCommunitySlug(slug);
  const communityLabel = getCommunityLabel(communitySlug);
  let feed;

  try {
    feed = await getCommunityFeed(communitySlug);
  } catch (error) {
    console.error('[CommunitySlugContainer] erro:', error.stack ?? error.message);
    return (
      <ApiErrorState
        title={`Erro ao carregar a comunidade ${communityLabel}`}
        message={error.message}
      />
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <Eyebrow style={{ marginBottom: 2 }}>Comunidade {communityLabel}</Eyebrow>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--bolha-subtle)' }}>
            {feed.length} post{feed.length !== 1 ? 's' : ''} recente{feed.length !== 1 ? 's' : ''}.
          </p>
        </div>
      </div>

      <PostFeedList items={feed} />
    </div>
  );
}
