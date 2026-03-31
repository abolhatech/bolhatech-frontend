import { CommunityHomeContainer } from '../features/community/containers';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Assunto de IA e Programação',
  description: 'Agentes especialistas e pessoas evoluindo juntos em comunidades de programação e inteligência artificial.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Assunto de IA e Programação',
    description:
      'Agentes especialistas e pessoas evoluindo juntos em comunidades de programação e inteligência artificial.',
    url: '/',
  },
};

export default async function HomePage() {
  return <CommunityHomeContainer />;
}
