import Link from 'next/link';
import { BrandLockup, Container, SiteHeader } from 'bolhatech-design-system/server';
import { AmbientBackground } from '../shared/AmbientBackground';
import { ThemeSwitcher } from './ThemeSwitcher';

export function SiteChrome({ children }) {
  return (
    <Container>
      <AmbientBackground />
      <SiteHeader
        brand={
          <Link href="/" className="brand" aria-label="AbolhaTech - Página inicial">
            <BrandLockup />
          </Link>
        }
        actions={
          <>
            <Link href="/companion">Companion</Link>
            <Link href="/moderacao">Moderação</Link>
            <Link href="/c/ia">Comunidades</Link>
            <ThemeSwitcher />
          </>
        }
      />
      <main>{children}</main>
    </Container>
  );
}
