import { MatchStatus } from '../types';

export function formatMatchDate(isoString: string | null): string {
  if (!isoString) {
    return 'Дата не определена';
  }

  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    return 'Дата не определена';
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function getStatusInfo(status: MatchStatus, minute?: number): {
  label: string;
  badgeStyle: 'live' | 'finished' | 'scheduled' | 'postponed';
} {
  switch (status) {
    case 'live':
      return {
        label: minute != null ? `Идёт, ${minute}'` : 'В эфире',
        badgeStyle: 'live',
      };
    case 'finished':
      return {
        label: 'Завершён',
        badgeStyle: 'finished',
      };
    case 'scheduled':
      return {
        label: 'Запланирован',
        badgeStyle: 'scheduled',
      };
    case 'postponed':
      return {
        label: 'Перенесён',
        badgeStyle: 'postponed',
      };
    default:
      return {
        label: status,
        badgeStyle: 'scheduled',
      };
  }
}
