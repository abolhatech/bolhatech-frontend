import { CompanionContainer } from '../../features/community/containers';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Companion',
  description: 'Seu companion aprende com suas interações e recomenda próximos passos.',
};

export default async function CompanionPage() {
  return <CompanionContainer />;
}
