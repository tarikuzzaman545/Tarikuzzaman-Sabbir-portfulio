/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  HOME
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  The site is multi-page. The home page is a compact index that earns the click
 *  into the dedicated routes — it is not the whole portfolio on one scroll. Its
 *  job, in order: state what I do (Hero), prove it with three case studies
 *  (FeaturedWork → /work), say what is on offer (ServicesPreview → /services),
 *  and give one clear way to start (CtaBanner → /contact).
 *
 *  DATA
 *  ────
 *  Only the two collections this page actually renders are fetched, in parallel.
 *  The full `getSiteContent()` also pulls process, testimonials and tools, which
 *  live on other routes now — fetching them here would be wasted work on the
 *  most-visited page.
 *
 *  RENDERING MODE
 *  ──────────────
 *  Static. In local-content mode it prerenders at build time; with Sanity the
 *  fetches carry `revalidate: 3600`. Either way the visitor gets HTML with no
 *  client fetch on the critical path. The only client islands are the header,
 *  theme toggle, hero motif and the Reveal wrappers.
 */

import type { Metadata } from 'next';

import { CtaBanner } from '@/components/sections/CtaBanner';
import { FeaturedWork } from '@/components/sections/FeaturedWork';
import { Hero } from '@/components/sections/Hero';
import { ServicesPreview } from '@/components/sections/ServicesPreview';
import { getProjects, getServices } from '@/lib/content';
import { absoluteUrl, siteConfig } from '@/site.config';

export const metadata: Metadata = {
  // `absolute` rather than a plain string, so the layout's "%s · Name" template
  // does not append the name twice on the home page.
  title: { absolute: siteConfig.seo.defaultTitle },
  description: siteConfig.valueProp,
  alternates: { canonical: absoluteUrl('/') },
};

export default async function HomePage() {
  const [projects, services] = await Promise.all([getProjects(), getServices()]);

  return (
    <>
      <Hero />
      <FeaturedWork projects={projects} />
      <ServicesPreview services={services} />
      <CtaBanner />
    </>
  );
}
