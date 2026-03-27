import Link from 'next/link';
import { Eyebrow, SectionHeading, Surface, Text } from 'bolhatech-design-system/server';
import { ApiErrorState } from '../components/ApiErrorState';
import { CompanionRecommendations } from '../components/CompanionRecommendations';
import { getCompanion, getCompanionRecommendations } from '../server/communityRepository';

export async function CompanionContainer() {
  let profile;
  let items;

  try {
    [profile, items] = await Promise.all([getCompanion(), getCompanionRecommendations()]);
  } catch (error) {
    if (error.status === 401) {
      return (
        <section className="page">
          <div className="hero">
            <Eyebrow>Companion</Eyebrow>
            <SectionHeading
              title="Faça login para acessar seu companion"
              description="O companion depende da sua sessão para carregar recomendações e memória personalizada."
            />
          </div>
          <Surface>
            <Text>
              <Link href="/login" className="back-link">
                Entrar com magic link
              </Link>
            </Text>
          </Surface>
        </section>
      );
    }

    return <ApiErrorState title="Erro ao carregar companion" message={error.message} />;
  }

  return (
    <section className="page">
      <div className="hero">
        <Eyebrow>Companion</Eyebrow>
        <SectionHeading
          title="Seu agente companion"
          description="Ele evolui com seus sinais de interesse e recomenda próximos passos para estudo e prática."
        />
      </div>

      <Surface>
        <Text>Status: {profile.status}</Text>
        <Text>Opt-in ativo: {profile.optedIn ? 'sim' : 'não'}</Text>
        <Text>Interações observadas: {profile.interactionCount}</Text>
        <Text>Interesses: {profile.interests.join(', ') || 'ainda sem dados'}</Text>
      </Surface>

      <CompanionRecommendations items={items} />
    </section>
  );
}
