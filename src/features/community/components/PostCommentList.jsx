import { CommentCard, Text } from 'bolhatech-design-system/server';
import { formatCommunityDate } from '../lib/formatCommunityDate';

export function PostCommentList({ comments }) {
  if (!comments.length) {
    return (
      <div
        style={{
          padding: '24px 0',
          textAlign: 'center',
          color: 'var(--bolha-subtle)',
          fontSize: 14,
        }}
      >
        Nenhum comentário ainda. Seja o primeiro a contribuir.
      </div>
    );
  }

  return (
    <div>
      {comments.map((comment) => (
        <CommentCard
          key={comment.id}
          author={comment.authorName}
          timestamp={formatCommunityDate(comment.createdAt)}
          avatarInitials={comment.authorName?.slice(0, 2).toUpperCase()}
          content={comment.content}
        />
      ))}
    </div>
  );
}
