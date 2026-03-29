import Link from 'next/link';
import {
  Eyebrow,
  SectionHeading,
  Surface,
  Text,
} from 'bolhatech-design-system/server';

export function ComingSoonPage({
  eyebrow = 'Em breve',
  title,
  description,
  backHref = '/',
  backLabel = 'Voltar para a comunidade',
}) {
  return (
    <section className="page article-page">
      <Surface as="section">
        <Eyebrow>{eyebrow}</Eyebrow>
        <SectionHeading title={title} description={description} />
        <Text>
          <Link href={backHref} className="back-link">
            {backLabel}
          </Link>
        </Text>
      </Surface>
    </section>
  );
}
