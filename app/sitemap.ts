/**
 * sitemap.xml, generated at build time.
 *
 * Next.js serves the return value of this file at /sitemap.xml with the correct
 * content type — no static file to keep in sync, and no risk of the XML drifting
 * from the routes that actually exist.
 *
 * WHY THE SECTION ANCHORS ARE NOT LISTED
 * ──────────────────────────────────────
 * A sitemap lists URLs, and `/#work` is the same URL as `/` as far as a crawler
 * is concerned — fragments are stripped before the request is made. Listing them
 * would be padding that Search Console reports as duplicates. The single-page
 * site legitimately has one entry.
 *
 * `lastModified` uses the build timestamp. That is honest for a statically
 * generated site: the content genuinely cannot have changed since the build.
 */

import type { MetadataRoute } from 'next';

import { absoluteUrl } from '@/site.config';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: absoluteUrl('/'),
      lastModified: now,
      // Not "always" — that value is widely ignored and slightly dishonest for
      // a portfolio that changes when new work lands, which is monthly at most.
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
