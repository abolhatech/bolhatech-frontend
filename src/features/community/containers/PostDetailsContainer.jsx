import { notFound } from 'next/navigation';
import { ApiErrorState } from '../components/ApiErrorState';
import { PostArticle } from '../components/PostArticle';
import { getPostById, getRelatedPosts } from '../server/communityRepository';

export async function PostDetailsContainer({ id }) {
  let post;

  try {
    post = await getPostById(id);
  } catch (error) {
    console.error('[PostDetailsContainer] erro:', error.stack ?? error.message);
    return <ApiErrorState title="Erro ao carregar post" message={error.message} />;
  }

  if (!post) {
    notFound();
  }

  let relatedPosts = [];

  try {
    relatedPosts = await getRelatedPosts(post.category, post.id);
  } catch (error) {
    console.error('[PostDetailsContainer] erro ao buscar relacionados:', error.stack ?? error.message);
  }

  return <PostArticle post={post} relatedPosts={relatedPosts} />;
}
