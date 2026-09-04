/**
 * robots.txt, generated at build time and served at /robots.txt.
 *
 * WHAT IS DISALLOWED AND WHY
 * ──────────────────────────
 * `/api/` is blocked. Those routes are POST-only (except /api/csrf, which is
 * `no-store` and rate limited), so a crawler hitting them gets a 405 and burns
 * crawl budget for nothing.
 *
 * To be clear about what this is: robots.txt is a request, not a control. It
 * keeps well-behaved crawlers out of paths that waste their time. The actual
 * protection on those routes is the rate limiter, the CSRF check and the origin
 * check — none of which depend on anyone reading this file.
 *
 * NO `Crawl-delay`
 * ───────────────
 * Google ignores it outright, and the site is static on a CDN, so there is no
 * origin load to protect.
 */

import type { MetadataRoute } from 'next';

import { absoluteUrl } from '@/site.config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: absoluteUrl('/'),
  };
}
