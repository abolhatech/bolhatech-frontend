import { getCanonicalUrl } from '@/lib/site';

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: getCanonicalUrl('/sitemap.xml'),
    host: getCanonicalUrl('/'),
  };
}
