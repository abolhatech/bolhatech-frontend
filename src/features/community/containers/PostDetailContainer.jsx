import Link from 'next/link';
import { ArticleHeader, Badge, Button, Surface, Text, communityVariant } from 'bolhatech-design-system/server';
import { ApiErrorState } from '../components/ApiErrorState';
import { PostCommentList } from '../components/PostCommentList';
import { PostInteractions } from '../components/PostInteractions';
import { getPostDetails } from '../server/communityRepository';

export async function PostDetailContainer({ postId }) {
  let post;
  let comments;

  try {
    ({ post, comments } = await getPostDetails(postId));
  } catch (error) {
    return <ApiErrorState title="Erro ao carregar post" message={error.message} />;
  }

  if (!post) {
    return null;
  }

  const score = (post.upvotes ?? 0) - (post.downvotes ?? 0);

  return (
    <section className="page article-page">
      {/* Botão de voltar */}
      <Link href={`/c/${post.communitySlug}`} className="back-link">
        ← {post.communitySlug}
      </Link>

      {/* Cabeçalho do artigo */}
      <ArticleHeader
        category={
          <Badge variant={communityVariant(post.communitySlug)} dot>
            {post.communitySlug}
          </Badge>
        }
        title={post.title}
        description={post.summary}
        meta={
          <>
            <span>{post.authorName}</span>
            <span
              style={{
                fontWeight: 600,
                color: score > 0
                  ? 'var(--bolha-up)'
                  : score < 0
                  ? 'var(--bolha-down)'
                  : 'var(--bolha-subtle)',
              }}
            >
              {score > 0 ? '+' : ''}{score} pontos
            </span>
          </>
        }
      />

      {/* Conteúdo */}
      {post.content ? (
        <div className="article-content">
          {post.content.split('\n\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      ) : null}

      {/* Interações (votação + comentário) */}
      <Surface style={{ padding: 16 }}>
        <PostInteractions
          postId={post.id}
          initialUpvotes={post.upvotes}
          initialDownvotes={post.downvotes}
        />
      </Surface>

      {/* Comentários */}
      <div>
        <h2
          style={{
            margin: '0 0 12px',
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--bolha-muted)',
          }}
        >
          {comments.length} comentário{comments.length !== 1 ? 's' : ''}
        </h2>
        <PostCommentList comments={comments} />
      </div>
    </section>
  );
}
