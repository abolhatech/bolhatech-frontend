import Link from 'next/link';

export function NewsBackLink() {
  return (
    <Link href="/" className="back-link">
      Voltar para a lista
    </Link>
  );
}
