import { formatDistanceToNowStrict, parseISO, format } from 'date-fns';

/**
 * Formats an ISO 8601 date string into a relative time string (e.g., "5m ago", "2h ago", "3d ago").
 * Handles potential invalid date inputs gracefully.
 * Addresses requirements for Stories 34, 48, 62.
 * @param dateString - The ISO 8601 date string to format.
 * @returns A formatted relative time string or an empty string if invalid.
 */
export function formatRelativeTime(dateString: string | undefined | null): string {
  if (!dateString) {
    return '';
  }
  try {
    const date = parseISO(dateString);
    // formatDistanceToNowStrict provides outputs like "5 minutes", "2 hours", "3 days"
    // We can shorten this manually for brevity if desired
    const distance = formatDistanceToNowStrict(date, { addSuffix: true });

    // Simple replacements for shorter format
    return distance
      .replace(' minutes', 'm')
      .replace(' minute', 'm')
      .replace(' hours', 'h')
      .replace(' hour', 'h')
      .replace(' days', 'd')
      .replace(' day', 'd')
      .replace(' months', 'mo') // Handle longer periods if needed
      .replace(' month', 'mo')
      .replace(' years', 'y')
      .replace(' year', 'y');

  } catch (error) {
    console.error("Error formatting relative time:", error);
    return ''; // Return empty string or a placeholder on error
  }
}

/**
 * Formats an ISO 8601 date string into a specific date/time format (e.g., "MMM d, yyyy, h:mm a").
 * Useful for displaying absolute timestamps if needed.
 * @param dateString - The ISO 8601 date string to format.
 * @param formatPattern - The date-fns format pattern (defaults to 'PPpp').
 * @returns A formatted date/time string or an empty string if invalid.
 */
export function formatAbsoluteTime(dateString: string | undefined | null, formatPattern: string = 'MMM d, yyyy, h:mm a'): string {
  if (!dateString) {
    return '';
  }
  try {
    const date = parseISO(dateString);
    return format(date, formatPattern);
  } catch (error) {
    console.error("Error formatting absolute time:", error);
    return '';
  }
}