import { Eyebrow, SectionHeading, Surface, Text } from 'bolhatech-design-system/server';

export function ModerationContainer() {
  return (
    <section className="page">
      <div className="hero">
        <Eyebrow>Moderação</Eyebrow>
        <SectionHeading
          title="Governança da comunidade"
          description="Moderadores de comunidade e admins centrais atuam em conjunto para manter qualidade e segurança."
        />
      </div>

      <Surface>
        <Text>Fluxo v1 implementado: ação de moderação com trilha de auditoria no backend.</Text>
        <Text>Papéis suportados: `moderator` e `admin`.</Text>
        <Text>Ações: hide, restore, warn, ban.</Text>
      </Surface>
    </section>
  );
}
