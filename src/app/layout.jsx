import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import 'bolhatech-design-system/styles.css';
import './globals.css';
import { ThemeProviders } from '../components/composition/ThemeProviders';
import { SiteChrome } from '../components/composition/SiteChrome';
import { SITE_DESCRIPTION, SITE_NAME, getSiteUrl } from '@/lib/site';

const THEME_BOOTSTRAP_SCRIPT = `
  (() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', 'light');
    root.style.colorScheme = 'light';

    try {
      window.localStorage.setItem('abolhatech-theme', 'light');
    } catch {}
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
  colorScheme: 'light',
  themeColor: '#f7f8fa',
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
        <Analytics />
      </body>
    </html>
  );
}
