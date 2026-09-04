/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  HOME — all nine sections, one server component
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  WHY ONE PAGE AND NOT NINE ROUTES
 *  ────────────────────────────────
 *  A portfolio is read in one pass. Splitting it across routes would mean a
 *  navigation for every section and would break the single scroll narrative the
 *  nav anchors depend on. Case studies open in a lightbox rather than a route
 *  for the same reason — nobody wants to lose their place in the grid.
 *
 *  DATA IS FETCHED ONCE, HERE
 *  ──────────────────────────
 *  `getSiteContent()` runs one `Promise.all` and passes plain typed props down.
 *  No section fetches for itself, so there is a single waterfall on the server
 *  and no chance of two sections disagreeing about the data.
 *
 *  RENDERING MODE
 *  ──────────────
 *  This is a static page. In local-content mode the whole thing prerenders at
 *  build time; with Sanity configured the fetches carry `revalidate: 3600`, so
 *  it is still served from the CDN and refreshes hourly. Either way the visitor
 *  gets HTML with no client fetch on the critical path.
 *
 *  The client islands are: Header, ThemeToggle, HeroMotif, PortfolioGrid (with
 *  Lightbox/BeforeAfter/VideoEmbed), Testimonials, the two forms, and the Reveal
 *  wrappers. Everything else is server-rendered and ships no JavaScript.
 *
 *  SECTION ORDER
 *  ─────────────
 *  Work comes before Services deliberately. Someone landing here wants to see
 *  whether the images are any good; a list of services means nothing until they
 *  have. Proof, then offer, then how it runs, then who I am, then contact.
 */

import type { Metadata } from 'next';

import { About } from '@/components/sections/About';
import { Contact } from '@/components/sections/Contact';
import { Hero } from '@/components/sections/Hero';
import { Process } from '@/components/sections/Process';
import { Services } from '@/components/sections/Services';
import { Stack } from '@/components/sections/Stack';
import { Testimonials } from '@/components/sections/Testimonials';
import { Work } from '@/components/sections/Work';
import { getSiteContent } from '@/lib/content';
import { absoluteUrl, siteConfig } from '@/site.config';

/**
 * Page-level metadata. The root layout supplies the title template, OG defaults
 * and robots rules; this only overrides what is genuinely page-specific — the
 * canonical URL and the description.
 */
export const metadata: Metadata = {
  // `default` rather than a string, so the layout's "%s · Name" template does
  // not append the name twice on the home page.
  title: { absolute: siteConfig.seo.defaultTitle },
  description: siteConfig.valueProp,
  alternates: { canonical: absoluteUrl('/') },
};

export default async function HomePage() {
  const { projects, services, process, testimonials, tools } = await getSiteContent();

  return (
    <>
      <Hero />
      <Work projects={projects} />
      <Services services={services} />
      <Process steps={process} />
      <Testimonials testimonials={testimonials} />
      <About />
      <Stack tools={tools} />
      <Contact />
    </>
  );
}
