export function formatCommunityDate(value) {
  const date = new Date(value);
  const now = new Date();

  if (Number.isNaN(date.getTime())) {
    return 'Data indisponível';
  }

  const options = {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  };

  if (date.getFullYear() !== now.getFullYear()) {
    options.year = 'numeric';
  }

  return new Intl.DateTimeFormat('pt-BR', options).format(date);
}
