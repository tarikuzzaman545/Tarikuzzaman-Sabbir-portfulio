'use client';

/**
 * Case-study lightbox.
 *
 * This is a modal dialog, and it is built like one rather than like a div with a
 * high z-index. Specifically:
 *
 *   · `role="dialog"` + `aria-modal="true"` + `aria-labelledby` pointing at the
 *     visible title, so a screen reader announces what opened and treats the
 *     page behind as inert.
 *   · Focus moves into the panel on open and returns to the element that
 *     triggered it on close. Losing your place in a grid of 20 projects because
 *     focus reset to <body> is a real and common failure.
 *   · Tab wraps at both ends of the panel. Escape closes. Arrow keys move
 *     between projects, which is what anyone browsing a gallery will try.
 *   · Body scroll is locked with scrollbar-width compensation, so opening the
 *     panel does not shift the page sideways underneath it.
 *
 * WHY NOT <dialog>
 * ────────────────
 * The native element would give the top layer and focus trapping for free, but
 * `showModal()` cannot be driven declaratively from React state without an
 * effect that fights the browser's own open/close bookkeeping, and its backdrop
 * cannot be animated with Framer Motion's exit transitions. For a component
 * that needs both animated entry/exit and state-driven open, the hand-rolled
 * version is less fragile. The trade is that the focus trap is ours to get
 * right, which is why it is explicit above.
 *
 * IMAGE STRATEGY
 * ──────────────
 * The active frame is `priority`, because it is the LCP element the moment the
 * panel opens. The thumbnail rail uses small fixed sizes. Nothing preloads the
 * whole gallery — a 12-image case study would otherwise pull several megabytes
 * on open.
 */

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { BeforeAfter } from '@/components/portfolio/BeforeAfter';
import { VideoEmbed } from '@/components/portfolio/VideoEmbed';
import { CATEGORY_LABELS, type Project } from '@/lib/content/types';
import { cn, slugifyId } from '@/lib/utils';

interface LightboxProps {
  project: Project | null;
  /** Called with the slug of the project to move to, or null to close. */
  onNavigate: (slug: string | null) => void;
  /** Ordered slugs of the currently visible (filtered) projects. */
  siblings: string[];
}

export function Lightbox({ project, onNavigate, siblings }: LightboxProps) {
  const [frame, setFrame] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();

  const open = project !== null;
  const titleId = project ? `lightbox-${slugifyId(project.slug)}` : undefined;

  /** cover first, then the gallery — the cover is what was clicked. */
  const frames = useMemo(() => {
    if (!project) return [];
    return [project.cover, ...project.gallery];
  }, [project]);

  const index = project ? siblings.indexOf(project.slug) : -1;
  const previousSlug = index > 0 ? siblings[index - 1] : undefined;
  const nextSlug = index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : undefined;

  /* Reset to the first frame whenever a different project opens. */
  useEffect(() => {
    setFrame(0);
  }, [project?.slug]);

  /* Remember what had focus before the panel opened, so it can be restored. */
  useEffect(() => {
    if (open && restoreFocusRef.current === null) {
      restoreFocusRef.current = document.activeElement as HTMLElement | null;
    }
  }, [open]);

  const close = useCallback(() => {
    onNavigate(null);
    // Deferred a frame so the element is focusable again after the panel unmounts.
    const target = restoreFocusRef.current;
    restoreFocusRef.current = null;
    requestAnimationFrame(() => target?.focus());
  }, [onNavigate]);

  /* ── Keyboard: Escape, Tab trap, arrow navigation ─────────────────────── */
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }

      if (event.key === 'ArrowLeft' && previousSlug) {
        event.preventDefault();
        onNavigate(previousSlug);
        return;
      }

      if (event.key === 'ArrowRight' && nextSlug) {
        event.preventDefault();
        onNavigate(nextSlug);
        return;
      }

      if (event.key !== 'Tab') return;

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, close, onNavigate, previousSlug, nextSlug]);

  /* ── Scroll lock ──────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!open) return;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    document.body.style.overflow = 'hidden';
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
    };
  }, [open]);

  /* ── Move focus in on open ────────────────────────────────────────────── */
  useEffect(() => {
    if (!open) return;
    // The close button is the safest landing spot: it is the first control and
    // it tells a screen-reader user immediately how to get out.
    const timer = window.setTimeout(() => closeRef.current?.focus(), 40);
    return () => window.clearTimeout(timer);
  }, [open, project?.slug]);

  const activeFrame = frames[frame];

  return (
    <AnimatePresence>
      {open && project && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto overscroll-contain p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.2 }}
        >
          {/* ── Backdrop ─────────────────────────────────────────────────── */}
          <div
            className="fixed inset-0 bg-ink/70 backdrop-blur-md"
            onClick={close}
            aria-hidden="true"
          />

          {/* ── Panel ────────────────────────────────────────────────────── */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.99 }}
            transition={{ duration: reduceMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative my-auto w-full max-w-6xl overflow-hidden rounded-card border border-line bg-canvas shadow-lift"
          >
            {/* ── Chrome ─────────────────────────────────────────────────── */}
            <div className="glass sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-6">
              <div className="min-w-0">
                <p className="truncate text-xs uppercase tracking-[0.12em] text-gold-ink">
                  {CATEGORY_LABELS[project.category]} · {project.year}
                </p>
                <p className="truncate text-sm font-medium text-ink">{project.client}</p>
              </div>

              <div className="flex shrink-0 items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => previousSlug && onNavigate(previousSlug)}
                  disabled={!previousSlug}
                  aria-label="Previous project"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-pill border border-line text-ink-soft transition-colors hover:border-gold/50 hover:text-ink disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => nextSlug && onNavigate(nextSlug)}
                  disabled={!nextSlug}
                  aria-label="Next project"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-pill border border-line text-ink-soft transition-colors hover:border-gold/50 hover:text-ink disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={close}
                  aria-label="Close case study"
                  className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-pill bg-ink text-canvas transition-transform hover:scale-105"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* ── Body ───────────────────────────────────────────────────── */}
            <div className="grid gap-8 p-4 sm:p-6 lg:grid-cols-2 lg:gap-10 lg:p-8">
              {/* ── Media column ─────────────────────────────────────────── */}
              <div>
                {activeFrame && (
                  <div
                    className="relative overflow-hidden rounded-xl border border-line bg-surface"
                    style={{
                      aspectRatio: `${activeFrame.width} / ${activeFrame.height}`,
                    }}
                  >
                    <Image
                      src={activeFrame.src}
                      alt={activeFrame.alt}
                      fill
                      sizes="(max-width: 1024px) 92vw, 560px"
                      className="object-cover"
                      priority
                      {...(activeFrame.blurDataURL
                        ? { placeholder: 'blur' as const, blurDataURL: activeFrame.blurDataURL }
                        : {})}
                    />
                  </div>
                )}

                {/* ── Thumbnail rail ────────────────────────────────────────
                    A tablist would be wrong here — these are not tab panels,
                    they are a set of radio-like choices over one viewer. Plain
                    buttons with aria-pressed is the honest mapping. */}
                {frames.length > 1 && (
                  <ul className="mt-3 grid grid-cols-6 gap-2">
                    {frames.map((image, position) => (
                      <li key={`${image.src}-${position}`}>
                        <button
                          type="button"
                          onClick={() => setFrame(position)}
                          aria-pressed={frame === position}
                          aria-label={`View frame ${position + 1} of ${frames.length}`}
                          className={cn(
                            'relative block w-full overflow-hidden rounded-lg border transition-all',
                            frame === position
                              ? 'border-gold ring-2 ring-gold/30'
                              : 'border-line opacity-70 hover:opacity-100',
                          )}
                          style={{ aspectRatio: '4 / 5' }}
                        >
                          <Image
                            src={image.src}
                            alt=""
                            fill
                            sizes="84px"
                            className="object-cover"
                          />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {project.video && (
                  <div className="mt-5">
                    <h4 className="mb-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
                      Motion
                    </h4>
                    <VideoEmbed video={project.video} sizes="(max-width: 1024px) 92vw, 560px" />
                  </div>
                )}

                {project.comparison && (
                  <div className="mt-5">
                    <h4 className="mb-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
                      Before / after
                    </h4>
                    <BeforeAfter
                      pair={project.comparison}
                      sizes="(max-width: 1024px) 92vw, 560px"
                    />
                  </div>
                )}
              </div>

              {/* ── Narrative column ─────────────────────────────────────── */}
              <div>
                <h2 id={titleId} className="text-display-sm text-ink">
                  {project.title}
                </h2>
                <p className="mt-3 text-body-lg text-ink-soft">{project.summary}</p>

                {project.metrics.length > 0 && (
                  <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 border-y border-line py-5">
                    {project.metrics.map((metric) => (
                      <div key={metric.label}>
                        <dd className="font-display text-xl font-semibold text-ink">
                          {metric.value}
                        </dd>
                        <dt className="mt-0.5 text-xs uppercase tracking-[0.1em] text-ink-muted">
                          {metric.label}
                        </dt>
                        {metric.note && (
                          <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                            {metric.note}
                          </p>
                        )}
                      </div>
                    ))}
                  </dl>
                )}

                <div className="mt-6 space-y-5">
                  {[
                    { heading: 'The problem', body: project.challenge },
                    { heading: 'What I did', body: project.approach },
                    { heading: 'The outcome', body: project.outcome },
                  ].map((block) => (
                    <div key={block.heading}>
                      <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-ink">
                        {block.heading}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{block.body}</p>
                    </div>
                  ))}
                </div>

                {project.tools.length > 0 && (
                  <div className="mt-6 border-t border-line pt-5">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
                      Tools
                    </h3>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {project.tools.map((tool) => (
                        <li key={tool} className="chip">
                          {tool}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <a href="#contact" onClick={close} className="btn-gold mt-7 w-full sm:w-auto">
                  Start a project like this
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
