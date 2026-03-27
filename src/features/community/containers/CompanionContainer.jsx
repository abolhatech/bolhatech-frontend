import { Eyebrow, SectionHeading, Surface, Text } from 'bolhatech-design-system/server';
import { CompanionRecommendations } from '../components/CompanionRecommendations';
import { getCompanion, getCompanionRecommendations } from '../server/communityRepository';

export async function CompanionContainer() {
  const [profile, items] = await Promise.all([getCompanion(), getCompanionRecommendations()]);

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
