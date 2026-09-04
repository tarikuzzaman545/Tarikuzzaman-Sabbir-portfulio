/**
 * Sanity read client + image URL builder.
 *
 * Both exports are nullable. Calling code must null-check, which is deliberate:
 * it makes the "no CMS configured" path a compile-time consideration rather
 * than a runtime surprise.
 */

import { createClient, type SanityClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';

import { apiVersion, dataset, isSanityConfigured, projectId, readToken, useCdn } from './env';

/**
 * The read client, or null when Sanity is not configured.
 *
 * `perspective: 'published'` means drafts never leak onto the live site.
 */
export const sanityClient: SanityClient | null = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn,
      perspective: 'published',
      ...(readToken ? { token: readToken } : {}),
    })
  : null;

/** Minimal structural type for a Sanity image asset reference. */
export interface SanityImageSource {
  asset?: { _ref?: string; _id?: string } | null;
  alt?: string | null;
  hotspot?: unknown;
  crop?: unknown;
}

const builder = sanityClient ? imageUrlBuilder(sanityClient) : null;

/**
 * Resolve a Sanity image reference to a CDN URL at a given width.
 *
 * Returns null when Sanity is off or the reference is empty, so callers can
 * fall back cleanly rather than rendering a broken <img>.
 */
export function sanityImageUrl(
  source: SanityImageSource | null | undefined,
  width: number,
): string | null {
  if (!builder || !source?.asset) return null;
  try {
    return builder.image(source as never).width(width).auto('format').fit('max').url();
  } catch {
    // A malformed asset reference should not take a page down.
    return null;
  }
}

/**
 * Pull intrinsic dimensions out of a Sanity asset _ref.
 *
 * Sanity encodes them in the ref itself — `image-<hash>-<w>x<h>-<ext>` — which
 * means we get width and height without a second network round trip, and
 * next/image can reserve layout space immediately.
 */
export function sanityImageDimensions(
  source: SanityImageSource | null | undefined,
): { width: number; height: number } | null {
  const ref = source?.asset?._ref ?? source?.asset?._id;
  if (!ref) return null;
  const match = /-(\d+)x(\d+)-/.exec(ref);
  if (!match) return null;
  const width = Number(match[1]);
  const height = Number(match[2]);
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return null;
  }
  return { width, height };
}
