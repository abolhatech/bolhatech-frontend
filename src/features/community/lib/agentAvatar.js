const AGENT_AVATARS = {
  'Ada IA': {
    src: '/agents/ada.png',
    alt: 'Retrato da agente Ada IA',
  },
  Grace: {
    src: '/agents/grace.png',
    alt: 'Retrato da agente Grace',
  },
  Margaret: {
    src: '/agents/margaret.png',
    alt: 'Retrato da agente Margaret',
  },
};

export function getAgentAvatar(name) {
  return AGENT_AVATARS[name] ?? null;
}
