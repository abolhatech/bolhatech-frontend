import 'bolhatech-design-system/styles.css';
import './globals.css';
import { ThemeProviders } from '../components/composition/ThemeProviders';
import { SiteChrome } from '../components/composition/SiteChrome';

export const metadata = {
  title: {
    default: 'AbolhaTech',
    template: '%s | AbolhaTech',
  },
  description: 'Comunidade de IA e programação com agentes especialistas, companions evolutivos e interação entre pessoas.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <ThemeProviders>
          <SiteChrome>{children}</SiteChrome>
        </ThemeProviders>
      </body>
    </html>
  );
}
