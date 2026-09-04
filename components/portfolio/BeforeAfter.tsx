'use client';

/**
 * Before / after comparison slider.
 *
 * THE CONTROL IS A REAL RANGE INPUT
 * ─────────────────────────────────
 * The handle is a transparent `<input type="range">` stretched across the frame,
 * not a div with pointer handlers. That one decision gives away, for free:
 *
 *   · Arrow-key and Home/End control, with the browser's own step logic
 *   · Touch, pen and mouse dragging, including correct pointer capture
 *   · A native accessibility role, value and orientation for screen readers
 *   · Correct behaviour when the page is zoomed or the element is transformed
 *
 * A hand-rolled div would need ~120 lines of pointer-event code to reach parity
 * and would still miss something. The visible handle is a sibling div positioned
 * from the same state, so it can be styled freely while the input stays the
 * thing that actually receives input.
 *
 * DRAG PERFORMANCE
 * ────────────────
 * The clip and the handle position are driven by a CSS custom property rather
 * than by re-rendering with a new inline width. React still re-renders on each
 * change, but the DOM diff is one style property on one element, and
 * `clip-path` + `translate` are composited. No layout is triggered while
 * dragging.
 *
 * IMAGE LOADING
 * ─────────────
 * Both frames use `fill` with a matching `sizes`, and the "after" frame renders
 * beneath the "before" so the version the client cares about is what shows if
 * the top image is still decoding. Neither is `priority` — this component is
 * always below the fold.
 */

import Image from 'next/image';
import { useId, useState } from 'react';

import type { BeforeAfterPair } from '@/lib/content/types';
import { cn } from '@/lib/utils';

export function BeforeAfter({
  pair,
  className,
  sizes = '(max-width: 768px) 100vw, 640px',
}: {
  pair: BeforeAfterPair;
  className?: string;
  sizes?: string;
}) {
  const [position, setPosition] = useState(50);
  const labelId = useId();

  return (
    <figure className={cn('group', className)}>
      <div
        className="relative overflow-hidden rounded-card border border-line bg-surface"
        style={{
          // Locked to the source aspect ratio so the two frames always align and
          // the box reserves its height before the images load.
          aspectRatio: `${pair.after.width} / ${pair.after.height}`,
          // Consumed by both the clip and the handle transform below.
          ['--pos' as string]: `${position}%`,
        }}
      >
        {/* ── After (underneath) ───────────────────────────────────────────── */}
        <Image
          src={pair.after.src}
          alt={pair.after.alt}
          fill
          sizes={sizes}
          className="object-cover"
          {...(pair.after.blurDataURL
            ? { placeholder: 'blur' as const, blurDataURL: pair.after.blurDataURL }
            : {})}
        />

        {/* ── Before (clipped on top) ──────────────────────────────────────
            inset() rather than a width, because clipping leaves the image at
            full size — so the visible portion is not squashed as the handle
            moves, which is what happens if you animate width instead. */}
        <div
          className="absolute inset-0"
          style={{ clipPath: 'inset(0 calc(100% - var(--pos)) 0 0)' }}
        >
          <Image
            src={pair.before.src}
            alt={pair.before.alt}
            fill
            sizes={sizes}
            className="object-cover"
            {...(pair.before.blurDataURL
              ? { placeholder: 'blur' as const, blurDataURL: pair.before.blurDataURL }
              : {})}
          />
        </div>

        {/* ── Corner labels ────────────────────────────────────────────────
            aria-hidden because the range input already announces what it
            controls; these are a visual orientation cue. */}
        <span
          className="pointer-events-none absolute left-3 top-3 rounded-pill bg-ink/75 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-canvas backdrop-blur-sm"
          aria-hidden="true"
        >
          Before
        </span>
        <span
          className="pointer-events-none absolute right-3 top-3 rounded-pill bg-gold px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#1A1A18] backdrop-blur-sm"
          aria-hidden="true"
        >
          After
        </span>

        {/* ── Visible handle ───────────────────────────────────────────────── */}
        <div
          className="pointer-events-none absolute inset-y-0 w-0.5 bg-canvas shadow-[0_0_0_1px_rgb(0_0_0/0.12)]"
          style={{ left: 'var(--pos)', transform: 'translateX(-50%)' }}
          aria-hidden="true"
        >
          <span className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-canvas shadow-lift transition-transform duration-200 group-hover:scale-110">
            {/* Two chevrons, drawn inline rather than imported — this is the only
                place they appear and lucide's ChevronsLeftRight is a heavier
                import than four path commands. */}
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 text-ink"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 7 4 12l5 5" />
              <path d="m15 7 5 5-5 5" />
            </svg>
          </span>
        </div>

        {/* ── The actual control ───────────────────────────────────────────── */}
        <label htmlFor={labelId} className="sr-only">
          {`Comparison slider: drag or use arrow keys to reveal the before and after of ${pair.caption}`}
        </label>
        <input
          id={labelId}
          type="range"
          min={0}
          max={100}
          step={0.5}
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          // Percentages, not pixels — "50%" is meaningful to a screen reader
          // where "50" alone is not.
          aria-valuetext={`${Math.round(position)}% before, ${100 - Math.round(position)}% after`}
          className={cn(
            'absolute inset-0 h-full w-full cursor-ew-resize appearance-none bg-transparent',
            // The thumb is stretched full-height and made invisible, so the whole
            // frame is draggable while the styled handle above provides the
            // visual. focus-visible still lands on this element.
            '[&::-webkit-slider-thumb]:h-[var(--thumb-h,100vh)] [&::-webkit-slider-thumb]:w-8',
            '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-transparent',
            '[&::-webkit-slider-thumb]:cursor-ew-resize',
            '[&::-moz-range-thumb]:h-full [&::-moz-range-thumb]:w-8 [&::-moz-range-thumb]:border-0',
            '[&::-moz-range-thumb]:bg-transparent [&::-moz-range-thumb]:cursor-ew-resize',
            '[&::-webkit-slider-runnable-track]:bg-transparent',
            '[&::-moz-range-track]:bg-transparent',
            'focus-visible:outline-offset-[-3px]',
          )}
        />
      </div>

      <figcaption className="mt-3 text-sm leading-relaxed text-ink-muted">
        {pair.caption}
      </figcaption>
    </figure>
  );
}
