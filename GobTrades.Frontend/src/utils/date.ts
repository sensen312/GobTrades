// src/utils/date.ts
import { formatDistanceToNowStrict, parseISO, format } from 'date-fns';

export function formatRelativeTime(dateString: string | undefined | null): string {
  if (!dateString) return '';
  try {
    const date = parseISO(dateString);
    const distance = formatDistanceToNowStrict(date, { addSuffix: true });
    return distance
      .replace(' minutes', 'm').replace(' minute', 'm')
      .replace(' hours', 'h').replace(' hour', 'h')
      .replace(' days', 'd').replace(' day', 'd')
      .replace(' months', 'mo').replace(' month', 'mo')
      .replace(' years', 'y').replace(' year', 'y');
  } catch (error) {
    console.error("Error formatting relative time:", error); return '';
  }
}
export function formatAbsoluteTime(dateString: string | undefined | null, formatPattern: string = 'MMM d, yy, h:mm a'): string {
  if (!dateString) return '';
  try {
    const date = parseISO(dateString);
    return format(date, formatPattern);
  } catch (error) {
    console.error("Error formatting absolute time:", error); return '';
  }
}
