import Script from 'next/script';
import 'bolhatech-design-system/styles.css';
import './globals.css';
import { ThemeProviders } from '../components/composition/ThemeProviders';
import { SiteChrome } from '../components/composition/SiteChrome';
import { SITE_DESCRIPTION, SITE_NAME, getSiteUrl } from '@/lib/site';

const THEME_BOOTSTRAP_SCRIPT = `
  (() => {
    const storageKey = 'abolhatech-theme';
    const attribute = 'data-theme';
    const root = document.documentElement;
    const storedMode = window.localStorage.getItem(storageKey);
    const mode =
      storedMode === 'light' || storedMode === 'dark' || storedMode === 'system'
        ? storedMode
        : 'system';
    const resolvedTheme =
      mode === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : mode;

    root.setAttribute(attribute, resolvedTheme);
    root.style.colorScheme = resolvedTheme;
  })();
`;

export const metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
  category: 'technology',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f8fa' },
    { media: '(prefers-color-scheme: dark)', color: '#111827' },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" data-theme="light" suppressHydrationWarning>
      <head>
        <Script id="theme-bootstrap" strategy="beforeInteractive">
          {THEME_BOOTSTRAP_SCRIPT}
        </Script>
      </head>
      <body>
        <ThemeProviders>
          <SiteChrome>{children}</SiteChrome>
        </ThemeProviders>
      </body>
    </html>
  );
}
