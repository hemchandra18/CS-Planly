/* ═══════════════════════════════════════════════════════
   CS-Planly — Utility Functions
   ═══════════════════════════════════════════════════════ */

import { format, differenceInDays, addDays, isToday, isTomorrow } from 'date-fns';

/**
 * Merge class names, filtering out falsy values.
 * Lightweight alternative to clsx/classnames.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Format a date string for display.
 */
export function formatDate(date: string | Date, pattern = 'MMM d, yyyy'): string {
  return format(new Date(date), pattern);
}

/**
 * Get a friendly label for a date (Today, Tomorrow, or formatted).
 */
export function friendlyDate(date: string | Date): string {
  const d = new Date(date);
  if (isToday(d)) return 'Today';
  if (isTomorrow(d)) return 'Tomorrow';
  return format(d, 'EEE, MMM d');
}

/**
 * Calculate days remaining until a target date.
 */
export function daysUntil(targetDate: string | Date): number {
  return Math.max(0, differenceInDays(new Date(targetDate), new Date()));
}

/**
 * Add days to a date.
 */
export function addDaysToDate(date: string | Date, days: number): Date {
  return addDays(new Date(date), days);
}

/**
 * Calculate percentage, clamped between 0 and 100.
 */
export function percentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.min(100, Math.max(0, Math.round((value / total) * 100)));
}

/**
 * Get initials from a full name (up to 2 characters).
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Format minutes to a friendly duration string.
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  if (remaining === 0) return `${hours} hr`;
  return `${hours} hr ${remaining} min`;
}

/**
 * Debounce a function call.
 */
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Generate a greeting based on time of day.
 */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

/**
 * Pluralize a word based on count.
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  if (count === 1) return singular;
  return plural ?? `${singular}s`;
}
