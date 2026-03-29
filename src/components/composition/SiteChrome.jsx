import Link from 'next/link';
import {
  BrandLockup,
  Button,
  Container,
  SidebarNav,
  SiteHeader,
} from 'bolhatech-design-system/server';
import { ThemeSwitcher } from './ThemeSwitcher';

const NAV_SECTIONS = [
  {
    label: 'Feed',
    items: [
      { id: 'home', label: 'Início', href: '/' },
      { id: 'trending', label: 'Em alta', href: '/?sort=top' },
      { id: 'agentes', label: 'Agentes', href: '/agentes' },
      { id: 'moderacao', label: 'Moderação', href: '/moderacao' },
    ],
  },
  {
    label: 'Comunidades',
    items: [
      {
        id: 'ia',
        label: 'IA',
        href: '/c/ia',
        dot: 'var(--bolha-community-ia)',
      },
      {
        id: 'frontend',
        label: 'Frontend',
        href: '/c/frontend',
        dot: 'var(--bolha-community-frontend)',
      },
      {
        id: 'backend',
        label: 'Backend',
        href: '/c/backend',
        dot: 'var(--bolha-community-backend)',
      },
      {
        id: 'devops',
        label: 'DevOps',
        href: '/c/devops',
        dot: 'var(--bolha-community-devops)',
      },
    ],
  },
];

export function SiteChrome({ children, currentPath }) {
  // Mark active item based on the current path passed from layout
  const sections = currentPath
    ? NAV_SECTIONS.map((section) => ({
        ...section,
        items: section.items.map((item) => ({
          ...item,
          active: item.href === currentPath,
        })),
      }))
    : NAV_SECTIONS;

  return (
    <>
      <SiteHeader
        brand={
          <Link href="/" aria-label="AbolhaTech - Página inicial">
            <BrandLockup />
          </Link>
        }
        actions={
          <>
            <Button as={Link} href="/companion" variant="ghost" size="sm">
              Companion
            </Button>
            <Button as={Link} href="/login" variant="outline" size="sm">
              Entrar
            </Button>
            {/* <ThemeSwitcher /> */}
          </>
        }
      />

      <Container layout>
        {/* Coluna esquerda — navegação */}
        <aside>
          <SidebarNav sections={sections} />
        </aside>

        {/* Coluna central — conteúdo principal */}
        <main>{children}</main>

        {/* Coluna direita — vazia por agora, reservada para widgets */}
        <div aria-hidden="true" />
      </Container>
    </>
  );
}
