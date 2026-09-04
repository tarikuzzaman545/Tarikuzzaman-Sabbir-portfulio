/**
 * sitemap.xml, generated at build time.
 *
 * Next.js serves the return value of this file at /sitemap.xml with the correct
 * content type — no static file to keep in sync, and no risk of the XML drifting
 * from the routes that actually exist.
 *
 * The site is multi-page, so this lists every real route: the four top-level
 * pages plus one entry per case study, pulled from the same content adapter the
 * pages render from. Deriving the case-study URLs here rather than hardcoding
 * them means a new project in data/ or Sanity appears in the sitemap on the next
 * build with no extra step.
 *
 * `lastModified` uses the build timestamp. That is honest for a statically
 * generated site: the content genuinely cannot have changed since the build.
 */

import type { MetadataRoute } from 'next';

import { getProjects } from '@/lib/content';
import { absoluteUrl } from '@/site.config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const projects = await getProjects();

  const topLevel: MetadataRoute.Sitemap = [
    // Not "always" for changeFrequency — that value is widely ignored and
    // slightly dishonest for a portfolio that changes when new work lands.
    { url: absoluteUrl('/'), lastModified: now, changeFrequency: 'monthly', priority: 1 },
    { url: absoluteUrl('/work'), lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: absoluteUrl('/services'), lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: absoluteUrl('/contact'), lastModified: now, changeFrequency: 'yearly', priority: 0.7 },
    { url: absoluteUrl('/about'), lastModified: now, changeFrequency: 'yearly', priority: 0.6 },
  ];

  const caseStudies: MetadataRoute.Sitemap = projects.map((project) => ({
    url: absoluteUrl(`/work/${project.slug}`),
    lastModified: now,
    changeFrequency: 'yearly',
    priority: 0.7,
  }));

  return [...topLevel, ...caseStudies];
}
