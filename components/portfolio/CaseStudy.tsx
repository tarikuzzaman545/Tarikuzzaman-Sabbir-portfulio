/**
 * Full case study — the body of a `/work/[slug]` page.
 *
 * A server component. The lightbox on the /work grid is a fast preview; this is
 * the long-form, linkable, SEO-indexable version of the same case study, so it
 * ships as static HTML with no modal machinery. The only interactive pieces are
 * the before/after slider and the click-to-load video, which are their own client
 * islands and are reused verbatim from the lightbox.
 *
 * Prev/next are passed in by the page rather than derived here, because the page
 * owns the ordered project list and this component should not re-fetch it.
 */

import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { BeforeAfter } from '@/components/portfolio/BeforeAfter';
import { VideoEmbed } from '@/components/portfolio/VideoEmbed';
import { Reveal } from '@/components/ui/Reveal';
import { CATEGORY_LABELS, type Project } from '@/lib/content/types';

type ProjectLink = Pick<Project, 'slug' | 'title'>;

interface CaseStudyProps {
  project: Project;
  prev?: ProjectLink | null;
  next?: ProjectLink | null;
}

export function CaseStudy({ project, prev, next }: CaseStudyProps) {
  return (
    <article>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="grain relative isolate overflow-hidden border-b border-line">
        <div className="shell pb-10 pt-28 sm:pt-32 lg:pt-36">
          <Link
            href="/work"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-gold-ink"
          >
            <ArrowLeft
              className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
            All work
          </Link>

          <p className="eyebrow mt-6 text-gold-ink">
            {CATEGORY_LABELS[project.category]} · {project.year}
          </p>
          <h1 className="mt-3 max-w-4xl text-balance text-display-lg text-ink">{project.title}</h1>
          <p className="mt-5 max-w-2xl text-body-lg text-ink-soft">{project.summary}</p>
          <p className="mt-4 text-sm text-ink-muted">
            Client: <span className="font-medium text-ink">{project.client}</span>
          </p>
        </div>
      </header>

      <div className="shell section">
        {/* ── Cover ────────────────────────────────────────────────────────── */}
        <Reveal>
          <div
            className="relative overflow-hidden rounded-card border border-line bg-surface"
            style={{ aspectRatio: `${project.cover.width} / ${project.cover.height}` }}
          >
            <Image
              src={project.cover.src}
              alt={project.cover.alt}
              fill
              // The cover is the LCP element on this route.
              sizes="(max-width: 1024px) 92vw, 1120px"
              className="object-cover"
              priority
              {...(project.cover.blurDataURL
                ? { placeholder: 'blur' as const, blurDataURL: project.cover.blurDataURL }
                : {})}
            />
          </div>
        </Reveal>

        {/* ── Metrics ──────────────────────────────────────────────────────── */}
        {project.metrics.length > 0 && (
          <Reveal>
            <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 border-y border-line py-8 sm:grid-cols-4">
              {project.metrics.map((metric) => (
                <div key={metric.label}>
                  <dd className="font-display text-2xl font-semibold text-ink sm:text-3xl">
                    {metric.value}
                  </dd>
                  <dt className="mt-1 text-xs uppercase tracking-[0.1em] text-ink-muted">
                    {metric.label}
                  </dt>
                  {metric.note && (
                    <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">{metric.note}</p>
                  )}
                </div>
              ))}
            </dl>
          </Reveal>
        )}

        {/* ── Narrative + rail ─────────────────────────────────────────────── */}
        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-10 lg:col-span-7">
            {[
              { heading: 'The challenge', body: project.challenge },
              { heading: 'The approach', body: project.approach },
              { heading: 'The outcome', body: project.outcome },
            ].map((block) => (
              <Reveal key={block.heading}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-ink">
                  {block.heading}
                </h2>
                <p className="mt-3 text-body-lg leading-relaxed text-ink-soft">{block.body}</p>
              </Reveal>
            ))}
          </div>

          {/* Tools rail */}
          {project.tools.length > 0 && (
            <Reveal className="lg:col-span-5" direction="left">
              <div className="card p-6 lg:p-7 lg:sticky lg:top-24">
                <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
                  Tools &amp; pipeline
                </h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {project.tools.map((tool) => (
                    <li key={tool} className="chip">
                      {tool}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 border-t border-line pt-5">
                  <p className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-soft">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                    <span>The prompt system built here is documented and handed over.</span>
                  </p>
                </div>
              </div>
            </Reveal>
          )}
        </div>

        {/* ── Before / after ───────────────────────────────────────────────── */}
        {project.comparison && (
          <Reveal className="mt-16">
            <h2 className="text-display-sm text-ink">Before &amp; after</h2>
            <p className="mt-2 max-w-2xl text-sm text-ink-soft">{project.comparison.caption}</p>
            <div className="mt-6 max-w-3xl">
              <BeforeAfter pair={project.comparison} sizes="(max-width: 1024px) 92vw, 768px" />
            </div>
          </Reveal>
        )}

        {/* ── Video ────────────────────────────────────────────────────────── */}
        {project.video && (
          <Reveal className="mt-16">
            <h2 className="text-display-sm text-ink">Motion</h2>
            <div className="mt-6 max-w-3xl">
              <VideoEmbed video={project.video} sizes="(max-width: 1024px) 92vw, 768px" />
            </div>
          </Reveal>
        )}

        {/* ── Gallery ──────────────────────────────────────────────────────── */}
        {project.gallery.length > 0 && (
          <Reveal className="mt-16">
            <h2 className="text-display-sm text-ink">Gallery</h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {project.gallery.map((image, position) => (
                <li
                  key={`${image.src}-${position}`}
                  className="relative overflow-hidden rounded-card border border-line bg-surface"
                  style={{ aspectRatio: `${image.width} / ${image.height}` }}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                    {...(image.blurDataURL
                      ? { placeholder: 'blur' as const, blurDataURL: image.blurDataURL }
                      : {})}
                  />
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        {/* ── CTA ──────────────────────────────────────────────────────────── */}
        <Reveal className="mt-16">
          <div className="rounded-card border border-gold/25 bg-gold/[0.06] px-6 py-10 text-center sm:px-10">
            <h2 className="text-display-sm text-ink">Want results like this?</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-ink-soft">
              Tell me what you are shooting and I will come back with a fixed price, a turnaround
              date, and a free sample.
            </p>
            <Link href="/contact" className="btn-gold group mt-6">
              Start a project
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </Reveal>

        {/* ── Prev / next ──────────────────────────────────────────────────── */}
        {(prev || next) && (
          <nav
            aria-label="More case studies"
            className="mt-14 grid gap-4 border-t border-line pt-8 sm:grid-cols-2"
          >
            {prev ? (
              <Link
                href={`/work/${prev.slug}`}
                className="card-interactive group flex flex-col gap-1 p-5 text-left"
              >
                <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.12em] text-ink-muted">
                  <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  Previous
                </span>
                <span className="font-medium text-ink transition-colors group-hover:text-gold-ink">
                  {prev.title}
                </span>
              </Link>
            ) : (
              <span aria-hidden="true" className="hidden sm:block" />
            )}

            {next && (
              <Link
                href={`/work/${next.slug}`}
                className="card-interactive group flex flex-col items-end gap-1 p-5 text-right sm:col-start-2"
              >
                <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.12em] text-ink-muted">
                  Next
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                <span className="font-medium text-ink transition-colors group-hover:text-gold-ink">
                  {next.title}
                </span>
              </Link>
            )}
          </nav>
        )}
      </div>
    </article>
  );
}
