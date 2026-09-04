'use client';

/**
 * Testimonials.
 *
 * WHY THIS SECTION RENDERS NOTHING WHEN EMPTY
 * ───────────────────────────────────────────
 * `data/testimonials.ts` ships as an empty array on purpose — a testimonial is a
 * quote attributed to a named real person, and inventing one would put words in
 * a real client's mouth. So this component returns null rather than showing
 * skeleton cards or placeholder quotes. An empty section is honest; a fake one
 * is a liability.
 *
 * Once real Upwork reviews are pasted in, the whole section appears with no
 * other change.
 *
 * LAYOUT: GRID ON DESKTOP, SNAP-SCROLL ON MOBILE
 * ──────────────────────────────────────────────
 * There is no carousel library here and no autoplay. On mobile the track is a
 * native `scroll-snap` container, which gives momentum scrolling, correct
 * touch physics and keyboard scrolling for free, and costs zero JavaScript. The
 * arrows call `scrollBy` on the same element.
 *
 * Autoplay was deliberately not built: it moves content out from under someone
 * mid-sentence and is a WCAG 2.2.2 problem unless paired with a pause control
 * that nobody uses. Manual advance only.
 */

import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import Image from 'next/image';
import { useRef } from 'react';

import { SectionHeading } from '@/components/ui/Reveal';
import type { Testimonial } from '@/lib/content/types';
import { cn, initialsOf } from '@/lib/utils';

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const trackRef = useRef<HTMLUListElement>(null);

  if (testimonials.length === 0) return null;

  const scroll = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    // Scroll by one card width plus the gap, derived from the first child so it
    // stays correct across breakpoints without hardcoding a pixel value.
    const card = track.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + 20 : track.clientWidth * 0.85;
    track.scrollBy({ left: step * direction, behavior: 'smooth' });
  };

  const scrollable = testimonials.length > 2;

  return (
    <section id="testimonials" className="section scroll-mt-24 border-t border-line">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Testimonials"
            title="What clients say"
            className="!max-w-xl"
          />

          {scrollable && (
            <div className="hidden items-center gap-2 lg:flex">
              <button
                type="button"
                onClick={() => scroll(-1)}
                aria-label="Previous testimonials"
                className="inline-flex h-10 w-10 items-center justify-center rounded-pill border border-line text-ink-soft transition-colors hover:border-gold/50 hover:text-ink"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => scroll(1)}
                aria-label="Next testimonials"
                className="inline-flex h-10 w-10 items-center justify-center rounded-pill border border-line text-ink-soft transition-colors hover:border-gold/50 hover:text-ink"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>

        <ul
          ref={trackRef}
          className={cn(
            'mt-10 gap-5 lg:mt-12',
            // Snap track on small screens; a plain grid once there is room for
            // three across, because horizontal scrolling on desktop is worse
            // than just showing everything.
            'snap-track -mx-gutter px-gutter pb-2 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0',
          )}
        >
          {testimonials.map((testimonial) => (
            <li
              key={testimonial.id}
              className="w-[86vw] shrink-0 snap-start sm:w-[60vw] lg:w-auto lg:shrink"
            >
              <TestimonialCard testimonial={testimonial} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="card flex h-full flex-col p-6 lg:p-7">
      <Quote className="h-6 w-6 shrink-0 text-gold/50" aria-hidden="true" />

      <blockquote className="mt-4 flex-1">
        <p className="text-base leading-relaxed text-ink-soft">{testimonial.quote}</p>
      </blockquote>

      {/* ── Rating ────────────────────────────────────────────────────────────
          The stars are aria-hidden and the value is stated in text, because five
          separate star icons announce as five meaningless graphics otherwise. */}
      <div className="mt-5 flex items-center gap-1" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            className={cn(
              'h-3.5 w-3.5',
              index < testimonial.rating ? 'fill-gold text-gold' : 'text-line-strong',
            )}
          />
        ))}
      </div>
      <span className="sr-only">{`Rated ${testimonial.rating} out of 5`}</span>

      <figcaption className="mt-4 flex items-center gap-3 border-t border-line pt-4">
        {testimonial.avatar ? (
          <Image
            src={testimonial.avatar.src}
            alt={testimonial.avatar.alt}
            width={40}
            height={40}
            sizes="40px"
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/[0.1] text-xs font-semibold text-gold-ink"
            aria-hidden="true"
          >
            {initialsOf(testimonial.author)}
          </span>
        )}

        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-ink">{testimonial.author}</p>
          <p className="truncate text-xs text-ink-muted">
            {testimonial.role}
            {testimonial.source && ` · via ${testimonial.source}`}
          </p>
        </div>
      </figcaption>
    </figure>
  );
}
