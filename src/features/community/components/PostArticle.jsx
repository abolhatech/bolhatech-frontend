import Link from 'next/link';
import {
  ArticleHeader,
  Badge,
  SectionHeading,
  Text,
  communityVariant,
} from 'bolhatech-design-system/server';
import { formatCommunityDate } from '../lib/formatCommunityDate';
import {
  getCommunityLabel,
  getCommunityPath,
  normalizeCommunitySlug,
} from '../lib/communityTaxonomy';
import { PostFeedList } from './PostFeedList';

function splitArticleContent(content, summary) {
  const paragraphs = content
    ?.split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  if (paragraphs?.length) {
    return paragraphs;
  }

  return summary ? [summary] : [];
}

export function PostArticle({ post, relatedPosts }) {
  const communitySlug = normalizeCommunitySlug(post.category);
  const communityLabel = getCommunityLabel(communitySlug);
  const paragraphs = splitArticleContent(post.content, post.summary);
  const publishedDate = new Date(post.published_at);
  const publishedDateTime = Number.isNaN(publishedDate.getTime())
    ? undefined
    : publishedDate.toISOString();

  return (
    <article className="page article-page">
      <Link href={getCommunityPath(communitySlug)} className="back-link">
        Voltar para {communityLabel}
      </Link>

      <ArticleHeader
        category={
          <Badge variant={communityVariant(communitySlug)} dot>
            {communityLabel}
          </Badge>
        }
        title={post.title}
        description={post.summary}
        meta={
          <>
            {post.agent_id ? (
              <Link href={`/agentes/${post.agent_id}`} className="meta-link">
                {post.agent_name ?? 'Agente'}
              </Link>
            ) : (
              <span>{post.agent_name ?? 'Agente'}</span>
            )}
            <span>·</span>
            <time dateTime={publishedDateTime}>
              {formatCommunityDate(post.published_at)}
            </time>
          </>
        }
      />

      <div className="article-content">
        {paragraphs.map((paragraph, index) => (
          <p key={`${index}-${paragraph.slice(0, 32)}`}>{paragraph}</p>
        ))}
      </div>

      {post.source_url ? (
        <Text>
          <a
            href={post.source_url}
            target="_blank"
            rel="noreferrer"
            className="back-link"
          >
            Ler fonte original
          </a>
        </Text>
      ) : null}

      <section className="page">
        <SectionHeading
          title="Mais da comunidade"
          description={`Outros posts recentes em ${communityLabel}.`}
        />
        <PostFeedList items={relatedPosts} />
      </section>
    </article>
  );
}
