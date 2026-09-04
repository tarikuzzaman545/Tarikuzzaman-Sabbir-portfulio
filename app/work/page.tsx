/**
 * /work — the full portfolio.
 *
 * This is the interactive index: live category filters, tool search, and a
 * lightbox, all inside `PortfolioGrid`. The page-level PageHeader supplies the
 * <h1>; the grid renders under it with no competing heading of its own. The
 * lightbox's "View full case study" links deep into /work/[slug], the long-form
 * version of each entry.
 *
 * Testimonials render below the grid as social proof. That section returns null
 * while `data/testimonials.ts` is empty, so nothing shows until real quotes exist.
 */

import type { Metadata } from 'next';

import { PortfolioGrid } from '@/components/portfolio/PortfolioGrid';
import { ProjectsJsonLd } from '@/components/seo/JsonLd';
import { Testimonials } from '@/components/sections/Testimonials';
import { PageHeader } from '@/components/site/PageHeader';
import { getProjects, getTestimonials } from '@/lib/content';
import { absoluteUrl } from '@/site.config';

export const metadata: Metadata = {
  title: 'Work',
  description:
    'AI-generated product and fashion photography case studies — real client engagements with the numbers attached. Filter by category or search by tool.',
  alternates: { canonical: absoluteUrl('/work') },
  openGraph: {
    title: 'Work · MD Tarikuzzaman Sabbir',
    description:
      'AI-generated product and fashion photography case studies, with the real numbers attached.',
    url: absoluteUrl('/work'),
  },
};

export default async function WorkPage() {
  const [projects, testimonials] = await Promise.all([getProjects(), getTestimonials()]);

  return (
    <>
      <PageHeader
        eyebrow="Portfolio"
        title="Selected work"
        lead="Each of these is a live client engagement with the actual numbers attached. Filter by category or search by tool — every card opens the full case study."
      />

      <div className="shell pb-section">
        {projects.length === 0 ? (
          <div className="card px-6 py-16 text-center">
            <p className="text-base font-medium text-ink">No projects published yet</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">
              Add entries to <code className="text-ink">data/projects.ts</code>, or publish project
              documents in Sanity if you have connected it.
            </p>
          </div>
        ) : (
          <>
            <PortfolioGrid projects={projects} />
            <ProjectsJsonLd projects={projects} />
          </>
        )}
      </div>

      <Testimonials testimonials={testimonials} />
    </>
  );
}
