/**
 * Small shared helpers. Nothing here should grow domain logic — if a function
 * starts knowing about projects or services, it belongs in `lib/content`.
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Conditional class names with Tailwind conflict resolution.
 *
 * `clsx` handles the conditionals; `twMerge` resolves conflicts so a later
 * utility wins — `cn('px-4', 'px-6')` gives `px-6` rather than both. That is
 * what makes component-level class overrides via props actually work.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Build an embed URL for a video provider.
 *
 * Only YouTube and Vimeo, and YouTube specifically via youtube-nocookie —
 * both because it sets no tracking cookie before playback, and because those
 * are the only two hosts the CSP `frame-src` allows. Adding a provider here
 * without adding it to `next.config.mjs` produces a blocked frame.
 *
 * The id is character-filtered rather than trusted: it may come from a CMS, and
 * an unfiltered value could break out of the URL path.
 */
export function videoEmbedUrl(provider: 'youtube' | 'vimeo', id: string): string | null {
  const safeId = id.replace(/[^a-zA-Z0-9_-]/g, '');
  if (!safeId) return null;

  if (provider === 'youtube') {
    return `https://www.youtube-nocookie.com/embed/${safeId}?rel=0&modestbranding=1`;
  }
  // Vimeo ids are numeric; reject anything else rather than build a dead URL.
  if (!/^\d+$/.test(safeId)) return null;
  return `https://player.vimeo.com/video/${safeId}?dnt=1`;
}

/** Initials for a monogram fallback, capped at two characters. */
export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
  return (first + last).toUpperCase() || '?';
}

/**
 * A stable, deterministic id from arbitrary text.
 *
 * Used for `aria-labelledby` / `aria-describedby` wiring where the id must match
 * between a server render and a client hydration. `Math.random()` or a counter
 * would produce a hydration mismatch; deriving from content cannot.
 */
export function slugifyId(input: string): string {
  return (
    input
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 64) || 'id'
  );
}

/** Clamp a number into a range. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
