import Link from 'next/link';
import { Surface, Text } from 'bolhatech-design-system/server';

export function ApiErrorState({ title = 'Falha ao carregar dados', message }) {
  return (
    <Surface>
      <Text>{title}</Text>
      <Text>{message || 'Não foi possível carregar os dados da API agora.'}</Text>
      <Text>
        <Link href="/" className="back-link">
          Voltar para a home
        </Link>
      </Text>
    </Surface>
  );
}
