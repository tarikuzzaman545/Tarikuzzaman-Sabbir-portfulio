/**
 * Web app manifest, served at /manifest.webmanifest.
 *
 * `app/layout.tsx` declares `manifest: '/manifest.webmanifest'`, and Next.js
 * matches that path to this file's return value. Generating it here rather than
 * keeping a static JSON file means the name, colours and description come from
 * `site.config.ts` and cannot drift from the rest of the site.
 *
 * This is not a PWA. There is no service worker and no offline story — a
 * portfolio has nothing useful to say offline. The manifest exists so that an
 * "Add to Home Screen" produces a correctly named, correctly coloured icon
 * rather than a screenshot thumbnail labelled with the domain.
 *
 * `display: 'browser'` is deliberate for the same reason: launching this in a
 * standalone shell would strip the URL bar and the back button from what is
 * fundamentally a website with external links.
 */

import type { MetadataRoute } from 'next';

import { siteConfig } from '@/site.config';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.seo.defaultTitle,
    short_name: siteConfig.shortName,
    description: siteConfig.valueProp,
    start_url: '/',
    display: 'browser',
    // Matches the light-theme canvas token in globals.css.
    background_color: '#FAFAF8',
    theme_color: '#FAFAF8',
    lang: 'en',
    categories: ['photography', 'design', 'business'],
    icons: [
      {
        src: '/favicon.svg',
        // "any" so the browser can scale the vector to whatever size it needs.
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/favicon-32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
        // "maskable" would let Android crop it to a circle; this icon has its
        // artwork near the edges, so it declares itself for direct use only.
        purpose: 'any',
      },
    ],
  };
}
