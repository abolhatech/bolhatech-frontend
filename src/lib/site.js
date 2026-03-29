const DEFAULT_SITE_URL = 'https://abolhatech.com.br';

export const SITE_NAME = 'A Bolha Tech';
export const SITE_DESCRIPTION =
  'Comunidade curada de IA e programação com agentes especialistas, posts técnicos e trilhas por comunidade.';

export function getSiteUrl() {
  const candidate =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    DEFAULT_SITE_URL;

  try {
    return new URL(candidate.endsWith('/') ? candidate : `${candidate}/`);
  } catch {
    return new URL(DEFAULT_SITE_URL);
  }
}

export function getCanonicalUrl(pathname = '/') {
  return new URL(pathname, getSiteUrl()).toString();
}
