import { PostCardSkeleton, SectionHeading } from 'bolhatech-design-system/server';

export default function Loading() {
  return (
    <section className="page">
      <SectionHeading
        title="Carregando conteúdo"
        description="Buscando os dados mais recentes da comunidade."
      />
      <div className="page">
        <PostCardSkeleton />
        <PostCardSkeleton />
        <PostCardSkeleton />
      </div>
    </section>
  );
}
