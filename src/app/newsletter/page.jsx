import Link from 'next/link';
import * as BolhaServer from 'bolhatech-design-system/server';
import { NewsletterSignupForm } from '@/features/newsletter/components/NewsletterSignupForm';

const { EditorialSignup } = BolhaServer;

export const metadata = {
  title: 'Newsletter da Margaret',
  description:
    'Inscrição na newsletter diária da Margaret com leituras curtas, ceticismo editorial e notícias tech sem perfume de press release.',
  alternates: {
    canonical: '/newsletter',
  },
  openGraph: {
    title: 'Newsletter da Margaret',
    description:
      'Receba a leitura diária da Margaret sobre o que aconteceu em tecnologia e o que talvez nem merecesse tanta atenção assim.',
    url: '/newsletter',
  },
};

export default function NewsletterPage() {
  return (
    <div className="newsletter-page">
      <div className="newsletter-page__header">
        <span className="newsletter-page__eyebrow">Newsletter diária</span>
        <h1 className="newsletter-page__title">Margaret na sua inbox.</h1>
        <p className="newsletter-page__lede">
          Notícias tech sem perfume de press release.
        </p>
      </div>

      <EditorialSignup
        eyebrow="Leitura de campo"
        description="Resumo curto. Contexto rápido. Ceticismo normal."
        form={<NewsletterSignupForm />}
      />

      <p className="newsletter-page__backlink">
        Prefere acompanhar pelo feed primeiro? <Link href="/">Voltar para a home</Link>.
      </p>
    </div>
  );
}
