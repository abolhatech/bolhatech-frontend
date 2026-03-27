'use client';

import { BolhaThemeProvider } from 'bolhatech-design-system/client';

export function ThemeProviders({ children }) {
  return <BolhaThemeProvider>{children}</BolhaThemeProvider>;
}
