import Link from 'next/link';
import { Eyebrow, SectionHeading, Text } from 'bolhatech-design-system/server';

export default function NotFound() {
  return (
    <section className="page article-page">
      <div className="hero">
        <Eyebrow>404</Eyebrow>
        <SectionHeading
          title="Esse conteúdo não foi encontrado."
          description="O link pode estar desatualizado ou a página pode ter sido removida."
        />
        <Text>
          <Link href="/" className="back-link">
            Voltar para a comunidade
          </Link>
        </Text>
      </div>
    </section>
  );
}
