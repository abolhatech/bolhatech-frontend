import Link from 'next/link';
import { ArticleHeader, Surface, Text } from 'bolhatech-design-system/server';
import { PostCommentList } from '../components/PostCommentList';
import { getPostDetails } from '../server/communityRepository';

export async function PostDetailContainer({ postId }) {
  const { post, comments } = await getPostDetails(postId);

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
        <Text>Comentários ({comments.length})</Text>
      </Surface>
      <PostCommentList comments={comments} />
    </section>
  );
}
