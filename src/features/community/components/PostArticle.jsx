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

function splitStructuredLead(content, summary) {
  const leadBlock = String(content || '')
    .split(/\n-{3,}\n/)
    .map((block) => block.trim())
    .filter(Boolean)[0];

  return splitArticleContent(leadBlock, summary);
}

function parseInlineSource(line) {
  const trimmed = String(line || '').trim();

  if (!trimmed) {
    return null;
  }

  const fonteMatch = trimmed.match(/^fonte:\s*(https?:\/\/\S+)$/i);
  if (fonteMatch) {
    return {
      source_url: fonteMatch[1],
      source_label: 'fonte original',
    };
  }

  const leiaMaisMatch = trimmed.match(/^leia mais\s*[–-]\s*(.+)$/i);
  if (leiaMaisMatch) {
    const value = leiaMaisMatch[1].trim();
    const urlMatch = value.match(/(https?:\/\/\S+)$/i);

    if (urlMatch) {
      return {
        source_url: urlMatch[1],
        source_label: value.replace(urlMatch[1], '').replace(/[,\s–-]+$/, '').trim() || 'fonte original',
      };
    }

    return {
      source_url: null,
      source_label: value,
    };
  }

  return null;
}

function parseStructuredSectionsFromContent(content) {
  const blocks = String(content || '')
    .split(/\n-{3,}\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks
    .slice(1, -1)
    .map((block) => {
      const lines = block
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);

      if (lines.length < 2) {
        return null;
      }

      const heading = lines[0];
      const lastLine = lines.at(-1);
      const source = parseInlineSource(lastLine);
      const bodyLines = source ? lines.slice(1, -1) : lines.slice(1);

      if (!bodyLines.length) {
        return null;
      }

      return {
        heading,
        body: bodyLines.join('\n\n'),
        source_url: source?.source_url ?? null,
        source_label: source?.source_label ?? 'fonte original',
      };
    })
    .filter(Boolean);
}

function getStructuredSections(post) {
  const sections = post?.content_json?.sections;

  if (Array.isArray(sections) && sections.length) {
    return sections.filter(
      (section) =>
        section &&
        typeof section.heading === 'string' &&
        typeof section.body === 'string'
    );
  }

  return parseStructuredSectionsFromContent(post?.content);
}

export function PostArticle({ post, relatedPosts }) {
  const communitySlug = normalizeCommunitySlug(post.category);
  const communityLabel = getCommunityLabel(communitySlug);
  const structuredSections = getStructuredSections(post);
  const paragraphs = structuredSections.length
    ? splitStructuredLead(post.content, post.summary)
    : splitArticleContent(post.content, post.summary);
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
        {structuredSections.length ? (
          <>
            {paragraphs.map((paragraph, index) => (
              <p key={`lead-${index}-${paragraph.slice(0, 32)}`}>{paragraph}</p>
            ))}
            {structuredSections.map((section, index) => (
              <section
                key={`${index}-${section.heading.slice(0, 32)}`}
                className="article-section"
              >
                <h2 className="article-section__title">{section.heading}</h2>
                <p>{section.body}</p>
                {section.source_url ? (
                  <Text>
                    <a
                      href={section.source_url}
                      target="_blank"
                      rel="noreferrer"
                      className="back-link"
                    >
                      Ler fonte: {section.source_label || 'fonte original'}
                    </a>
                  </Text>
                ) : null}
              </section>
            ))}
          </>
        ) : (
          paragraphs.map((paragraph, index) => (
            <p key={`${index}-${paragraph.slice(0, 32)}`}>{paragraph}</p>
          ))
        )}
      </div>

      {!structuredSections.length && post.source_url ? (
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
