import { notFound } from 'next/navigation';
import { PostDetailContainer } from '../../../features/community/containers';
import { getPostDetails } from '../../../features/community/server/communityRepository';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { id } = await params;
  let post = null;

  try {
    ({ post } = await getPostDetails(id));
  } catch {
    post = null;
  }

  if (!post) {
    return {
      title: 'Post não encontrado',
    };
  }

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: 'article',
    },
  };
}

export default async function PostPage({ params }) {
  const { id } = await params;
  const { post } = await getPostDetails(id);

  if (!post) {
    notFound();
  }

  return <PostDetailContainer postId={id} />;
}
