export const COMMUNITY_SLUGS = ['ia', 'frontend', 'backend', 'devops'];

const COMMUNITY_LABELS = {
  ia: 'IA',
  frontend: 'Frontend',
  backend: 'Backend',
  devops: 'DevOps',
};

export function normalizeCommunitySlug(value = '') {
  return String(value).replace(/^c\//, '').trim().toLowerCase();
}

export function getCommunitySlug(value) {
  const slug = normalizeCommunitySlug(value);
  return COMMUNITY_SLUGS.includes(slug) ? slug : null;
}

export function isKnownCommunitySlug(value) {
  return Boolean(getCommunitySlug(value));
}

export function getCommunityCategory(value) {
  const slug = getCommunitySlug(value);
  return slug ? `c/${slug}` : null;
}

export function getCommunityPath(value) {
  const slug = getCommunitySlug(value);
  return slug ? `/c/${slug}` : '/';
}

export function getCommunityLabel(value) {
  const slug = normalizeCommunitySlug(value);
  return COMMUNITY_LABELS[slug] ?? 'Comunidade';
}
