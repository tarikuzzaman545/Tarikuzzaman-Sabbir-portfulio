/**
 * Featured work — the home page's proof section.
 *
 * A server component. Unlike the full /work grid this is not filterable and does
 * not open a lightbox: it shows the three featured case studies as links into the
 * dedicated `/work/[slug]` routes, with a "View all work" link to the full grid.
 * The home page's job is to earn the click through to the portfolio, not to be
 * the portfolio.
 *
 * The three cards are chosen by the `featured` flag in the content, falling back
 * to the first three projects if fewer than three are flagged — so the section
 * never renders a short or empty row on a sparse dataset.
 */

import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { RevealGroup, RevealItem, SectionHeading } from '@/components/ui/Reveal';
import { CATEGORY_LABELS, type Project } from '@/lib/content/types';

export function FeaturedWork({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;

  const featured = projects.filter((project) => project.featured);
  const shown = (featured.length >= 3 ? featured : projects).slice(0, 3);

  return (
    <section className="section border-t border-line">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Selected work"
            title="Proof, not promises"
            lead="A few recent engagements with the real numbers attached. Each opens the full case study."
            className="!max-w-xl"
          />

          <Link
            href="/work"
            className="btn-outline group hidden shrink-0 sm:inline-flex"
          >
            View all work
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>

        <RevealGroup
          as="ul"
          className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3"
          stagger={0.08}
        >
          {shown.map((project) => (
            <RevealItem key={project.slug} as="li" className="flex">
              <FeaturedCard project={project} />
            </RevealItem>
          ))}
        </RevealGroup>

        {/* The desktop link lives in the header row; this one is for narrow
            screens where that row wraps and the button is hidden. */}
        <Link href="/work" className="btn-outline group mt-8 w-full sm:hidden">
          View all work
          <ArrowRight
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>
    </section>
  );
}

function FeaturedCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="card-interactive group flex h-full w-full flex-col overflow-hidden"
      aria-label={`View case study: ${project.title} for ${project.client}`}
    >
      <div
        className="relative w-full overflow-hidden bg-surface"
        style={{ aspectRatio: `${project.cover.width} / ${project.cover.height}` }}
      >
        <Image
          src={project.cover.src}
          alt={project.cover.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          {...(project.cover.blurDataURL
            ? { placeholder: 'blur' as const, blurDataURL: project.cover.blurDataURL }
            : {})}
        />
        <span className="absolute left-3 top-3 rounded-pill bg-canvas/90 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-ink backdrop-blur-sm">
          {CATEGORY_LABELS[project.category]}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs uppercase tracking-[0.12em] text-ink-muted">
          {project.client} · {project.year}
        </p>
        <h3 className="mt-1.5 text-base font-semibold leading-snug text-ink transition-colors group-hover:text-gold-ink">
          {project.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-soft">{project.summary}</p>

        <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-medium text-gold-ink">
          Read case study
          <ArrowRight
            className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  );
}
