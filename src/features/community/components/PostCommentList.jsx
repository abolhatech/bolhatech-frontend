import { Surface, Text } from 'bolhatech-design-system/server';
import { formatCommunityDate } from '../lib/formatCommunityDate';

export function PostCommentList({ comments }) {
  if (!comments.length) {
    return (
      <Surface>
        <Text>Nenhum comentário ainda. Seja o primeiro a contribuir.</Text>
      </Surface>
    );
  }

  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <Surface key={comment.id}>
          <Text>{comment.content}</Text>
          <Text>{comment.authorName} • {formatCommunityDate(comment.createdAt)}</Text>
        </Surface>
      ))}
    </div>
  );
}
