'use client';

/**
 * Filterable portfolio grid.
 *
 * FILTERING IS PURE CLIENT STATE
 * ──────────────────────────────
 * All projects are rendered from props on the server and filtered with a
 * `useMemo` over local state. No fetch, no route change, no loading state — the
 * brief asked for "real-time client-side filter/search by category, no page
 * reload", and with a project count in the tens this is both the simplest and
 * the fastest possible implementation. There is no pagination to invalidate and
 * nothing to refetch.
 *
 * SEARCH SEARCHES THE WHOLE CASE STUDY
 * ────────────────────────────────────
 * The query matches title, client, summary, category label AND the tools list,
 * so typing "higgsfield" or "comfyui" finds work by pipeline rather than only by
 * name. The haystack for each project is built once per project and memoised;
 * rebuilding it on every keystroke would be wasted work.
 *
 * LAYOUT ANIMATION
 * ────────────────
 * Cards use Framer's `layout` so a filter change slides them into their new
 * positions instead of snapping. `AnimatePresence` with `popLayout` mode takes
 * removed cards out of layout flow immediately, so the remaining cards close the
 * gap while the removed one fades — without it they wait for the exit to finish
 * and the grid visibly stutters.
 *
 * COUNT ANNOUNCEMENTS
 * ───────────────────
 * The result count sits in an `aria-live="polite"` region. Without it, a screen
 * reader user typing in the search box gets no feedback that anything happened,
 * because the visual change is entirely off-focus.
 */

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Lightbox } from '@/components/portfolio/Lightbox';
import { CATEGORY_LABELS, CATEGORY_ORDER, type Project, type ProjectCategory } from '@/lib/content/types';
import { cn } from '@/lib/utils';

type Filter = ProjectCategory | 'all';

/** Lowercased searchable text for one project, built once. */
function haystackFor(project: Project): string {
  return [
    project.title,
    project.client,
    project.summary,
    CATEGORY_LABELS[project.category],
    project.challenge,
    ...project.tools,
  ]
    .join(' ')
    .toLowerCase();
}

export function PortfolioGrid({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  /* Search index, rebuilt only if the project list itself changes. */
  const haystacks = useMemo(() => {
    const map = new Map<string, string>();
    for (const project of projects) map.set(project.slug, haystackFor(project));
    return map;
  }, [projects]);

  /* Only offer filter chips for categories that actually have work in them —
     an empty tab is a dead end that makes the site look unfinished. */
  const availableCategories = useMemo(() => {
    const present = new Set(projects.map((project) => project.category));
    return CATEGORY_ORDER.filter((category) => present.has(category));
  }, [projects]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return projects.filter((project) => {
      if (filter !== 'all' && project.category !== filter) return false;
      if (needle === '') return true;
      return (haystacks.get(project.slug) ?? '').includes(needle);
    });
  }, [projects, filter, query, haystacks]);

  const visibleSlugs = useMemo(() => visible.map((project) => project.slug), [visible]);
  const openProject = useMemo(
    () => projects.find((project) => project.slug === openSlug) ?? null,
    [projects, openSlug],
  );

  /* If the open project is filtered out from under the lightbox, close it rather
     than leaving a panel open over a grid that no longer contains it. */
  useEffect(() => {
    if (openSlug && !visibleSlugs.includes(openSlug)) setOpenSlug(null);
  }, [openSlug, visibleSlugs]);

  const clearAll = useCallback(() => {
    setFilter('all');
    setQuery('');
  }, []);

  const isFiltered = filter !== 'all' || query.trim() !== '';

  return (
    <>
      {/* ── Controls ───────────────────────────────────────────────────────── */}
      <div className="mt-10 flex flex-col gap-4 lg:mt-12 lg:flex-row lg:items-center lg:justify-between">
        {/* Filter chips. A radiogroup, because exactly one is always active. */}
        <div
          role="radiogroup"
          aria-label="Filter work by category"
          className="flex flex-wrap items-center gap-2"
        >
          <FilterChip
            label="All work"
            count={projects.length}
            active={filter === 'all'}
            onSelect={() => setFilter('all')}
          />
          {availableCategories.map((category) => (
            <FilterChip
              key={category}
              label={CATEGORY_LABELS[category]}
              count={projects.filter((project) => project.category === category).length}
              active={filter === category}
              onSelect={() => setFilter(category)}
            />
          ))}
        </div>

        {/* Search */}
        <div className="relative lg:w-72">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search work, clients, tools…"
            aria-label="Search work by title, client or tool"
            className="field !py-2.5 !pl-10 !pr-10 !text-sm"
          />
          {query !== '' && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-ink/5 hover:text-ink"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* ── Live count ─────────────────────────────────────────────────────── */}
      <p aria-live="polite" className="mt-4 text-sm text-ink-muted">
        {visible.length === projects.length
          ? `${projects.length} ${projects.length === 1 ? 'project' : 'projects'}`
          : `${visible.length} of ${projects.length} ${projects.length === 1 ? 'project' : 'projects'}`}
        {isFiltered && (
          <>
            {' · '}
            <button type="button" onClick={clearAll} className="link-underline font-medium">
              Clear filters
            </button>
          </>
        )}
      </p>

      {/* ── Grid ───────────────────────────────────────────────────────────── */}
      {visible.length === 0 ? (
        <div className="card mt-6 flex flex-col items-center gap-3 px-6 py-16 text-center">
          <SlidersHorizontal className="h-6 w-6 text-ink-muted" aria-hidden="true" />
          <p className="text-base font-medium text-ink">Nothing matches that yet</p>
          <p className="max-w-sm text-sm text-ink-soft">
            Try a broader term, or clear the filters to see everything.
          </p>
          <button type="button" onClick={clearAll} className="btn-outline mt-1 !py-2 text-sm">
            Clear filters
          </button>
        </div>
      ) : (
        <motion.ul layout className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((project) => (
              <motion.li
                key={project.slug}
                layout={!reduceMotion}
                initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                transition={{ duration: reduceMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
                // A featured project takes two columns from md up, which gives
                // the grid a deliberate rhythm rather than a uniform tile field.
                className={cn(project.featured && 'sm:col-span-2 lg:col-span-1')}
              >
                <ProjectCard project={project} onOpen={() => setOpenSlug(project.slug)} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}

      <Lightbox project={openProject} onNavigate={setOpenSlug} siblings={visibleSlugs} />
    </>
  );
}

/* ── Filter chip ──────────────────────────────────────────────────────────── */

function FilterChip({
  label,
  count,
  active,
  onSelect,
}: {
  label: string;
  count: number;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onSelect}
      className={cn(
        'inline-flex items-center gap-2 rounded-pill border px-4 py-2 text-sm font-medium transition-all duration-200',
        active
          ? 'border-gold bg-gold/[0.12] text-ink'
          : 'border-line bg-surface text-ink-soft hover:border-line-strong hover:text-ink',
      )}
    >
      {label}
      <span
        className={cn(
          'rounded-pill px-1.5 py-0.5 text-[0.68rem] tabular-nums',
          active ? 'bg-gold/25 text-ink' : 'bg-ink/[0.06] text-ink-muted',
        )}
      >
        {count}
      </span>
    </button>
  );
}

/* ── Card ─────────────────────────────────────────────────────────────────── */

function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  return (
    <article className="card-interactive group h-full overflow-hidden">
      {/* The whole card is one button, so there is a single tab stop per project
          rather than three competing ones (image, title, "view"). */}
      <button
        type="button"
        onClick={onOpen}
        className="flex h-full w-full flex-col text-left"
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
            // Three columns at desktop, two at tablet, one on mobile — the sizes
            // string has to mirror that or the browser downloads a full-width
            // image for a third-width slot.
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            {...(project.cover.blurDataURL
              ? { placeholder: 'blur' as const, blurDataURL: project.cover.blurDataURL }
              : {})}
          />

          <span className="absolute left-3 top-3 rounded-pill bg-canvas/90 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-ink backdrop-blur-sm">
            {CATEGORY_LABELS[project.category]}
          </span>

          {project.comparison && (
            <span className="absolute right-3 top-3 rounded-pill bg-gold px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-[#1A1A18]">
              Before / after
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <p className="text-xs uppercase tracking-[0.12em] text-ink-muted">
            {project.client} · {project.year}
          </p>
          <h3 className="mt-1.5 text-base font-semibold leading-snug text-ink transition-colors group-hover:text-gold-ink">
            {project.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{project.summary}</p>

          {project.metrics[0] && (
            <p className="mt-auto pt-4 text-sm font-medium text-ink">
              <span className="text-gold-ink">{project.metrics[0].value}</span>{' '}
              <span className="text-ink-muted">{project.metrics[0].label.toLowerCase()}</span>
            </p>
          )}
        </div>
      </button>
    </article>
  );
}
