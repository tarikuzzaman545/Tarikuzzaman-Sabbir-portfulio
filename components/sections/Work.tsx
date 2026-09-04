/**
 * Portfolio / case studies section.
 *
 * A server component wrapper around the client grid. The split matters: the
 * heading, the intro copy and the structured data are static HTML, and only the
 * filtering machinery is hydrated. Making the whole section a client component
 * would send the copy through the JS bundle for no reason.
 */

import { ProjectsJsonLd } from '@/components/seo/JsonLd';
import { PortfolioGrid } from '@/components/portfolio/PortfolioGrid';
import { SectionHeading } from '@/components/ui/Reveal';
import type { Project } from '@/lib/content/types';

export function Work({ projects }: { projects: Project[] }) {
  return (
    <section id="work" className="section scroll-mt-24 border-t border-line">
      <div className="shell">
        <SectionHeading
          eyebrow="Selected work"
          title="Real projects, real constraints"
          lead="Each of these is a live client engagement with the actual numbers attached. Filter by category or search by tool — every card opens the full case study."
        />

        {projects.length === 0 ? (
          /* Defensive: a Sanity dataset with no published projects should show a
             clear message rather than an empty grid that looks broken. */
          <div className="card mt-10 px-6 py-16 text-center">
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
    </section>
  );
}
