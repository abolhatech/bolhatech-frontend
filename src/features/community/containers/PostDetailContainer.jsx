import Link from 'next/link';
import { ArticleHeader, Surface, Text } from 'bolhatech-design-system/server';
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

  return (
    <section className="page article-page">
      <Link href={`/c/${post.communitySlug}`} className="back-link">Voltar para r/{post.communitySlug}</Link>

      <ArticleHeader
        eyebrow={`r/${post.communitySlug}`}
        title={post.title}
        description={post.summary}
        metadata={`${post.authorName} • ${post.upvotes}↑ ${post.downvotes}↓`}
      />

      <div className="article-content">
        <Text>{post.content}</Text>
      </div>

      <Surface>
        <PostInteractions postId={post.id} initialUpvotes={post.upvotes} initialDownvotes={post.downvotes} />
      </Surface>

      <Surface>
        <Text>Comentários ({comments.length})</Text>
      </Surface>
      <PostCommentList comments={comments} />
    </section>
  );
}
