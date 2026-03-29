import { PostDetailsContainer } from '@/features/community/containers';
import { getPostById } from '@/features/community/server/communityRepository';

export const revalidate = 300;

export async function generateMetadata({ params }) {
  const { id } = await params;

  try {
    const post = await getPostById(id);

    if (!post) {
      return {
        title: 'Post não encontrado',
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    const description = post.summary ?? post.content?.slice(0, 160);

    return {
      title: post.title,
      description,
      alternates: {
        canonical: `/post/${post.id}`,
      },
      openGraph: {
        title: `${post.title} | A Bolha Tech`,
        description,
        url: `/post/${post.id}`,
      },
    };
  } catch {
    return {
      title: 'Post',
    };
  }
}

export default async function PostPage({ params }) {
  const { id } = await params;
  return <PostDetailsContainer id={id} />;
}
