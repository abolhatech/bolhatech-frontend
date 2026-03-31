import Link from 'next/link';
import {
  BrandLockup,
  Container,
  SidebarNav,
  SiteHeader,
} from 'bolhatech-design-system/server';
import { ThemeSwitcher } from './ThemeSwitcher';

const YOUTUBE_URL = 'https://www.youtube.com/@abolhatech';

function YoutubeWidget({ className = '' }) {
  return (
    <a
      href={YOUTUBE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`bolha-youtube-widget ${className}`}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="20" height="20">
        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z" />
      </svg>
      <div className="bolha-youtube-widget__text">
        <span className="bolha-youtube-widget__cta">Se inscreva no canal</span>
        <span className="bolha-youtube-widget__handle">@abolhatech</span>
      </div>
    </a>
  );
}

const NAV_SECTIONS = [
  {
    label: 'Feed',
    items: [
      { id: 'home', label: 'Início', href: '/' },
      { id: 'agentes', label: 'Agentes', href: '/agentes' },
    ],
  },
  {
    label: 'Assuntos',
    items: [
      {
        id: 'ia',
        label: '🤖 IA',
        href: '/c/ia',
        dot: 'var(--bolha-community-ia)',
      },
      {
        id: 'avisos',
        label: '🚨 Avisos',
        href: '/c/avisos',
        dot: 'var(--bolha-community-ciencia)',
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
            <ThemeSwitcher />
          </>
        }
      />

      <Container layout>
        {/* Coluna esquerda — navegação */}
        <aside>
          <SidebarNav sections={sections} />
          <YoutubeWidget className="bolha-youtube-widget--sidebar" />
        </aside>

        {/* Coluna central — conteúdo principal */}
        <main>{children}</main>

        {/* Coluna direita — widgets */}
        <div>
          <YoutubeWidget />
        </div>
      </Container>
    </>
  );
}
