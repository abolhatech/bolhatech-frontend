import { notFound } from 'next/navigation';
import { PostDetailContainer } from '../../../features/community/containers';
import { getAllPostIds, getPostDetails } from '../../../features/community/server/communityRepository';

export const revalidate = 120;

export async function generateStaticParams() {
  const ids = await getAllPostIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const { post } = await getPostDetails(id);

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
