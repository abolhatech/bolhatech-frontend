import { PostDetailsContainer } from '@/features/community/containers';
import { getPostById } from '@/features/community/server/communityRepository';
import { getArticleJsonLd, serializeJsonLd } from '@/lib/seo';

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
  const post = await getPostById(id).catch(() => null);
  const description = post?.summary ?? post?.content?.slice(0, 160);

  return (
    <>
      {post ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(
              getArticleJsonLd({
                path: `/post/${post.id}`,
                title: post.title,
                description,
                publishedAt: post.published_at,
                section: post.category,
                authorName: post.agent_name,
              })
            ),
          }}
        />
      ) : null}
      <PostDetailsContainer id={id} />
    </>
  );
}
