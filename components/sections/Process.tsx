/**
 * Process timeline.
 *
 * The timeline rail is a single absolutely-positioned 1px element behind the
 * list, not a border on each item. A per-item border produces visible seams
 * where the items meet, and the last item's border has to be removed
 * conditionally — a rail avoids both problems and lets the numerals sit on top
 * of a continuous line.
 *
 * `clientAction` is rendered as its own callout rather than folded into the
 * description because it is the part people skim for. Being explicit about what
 * the client owes at each step is the cheapest way to avoid the delay where both
 * sides are waiting on each other.
 */

import { ArrowRight, Clock, UserCheck } from 'lucide-react';

import { Reveal, RevealGroup, RevealItem, SectionHeading } from '@/components/ui/Reveal';
import type { ProcessStep } from '@/lib/content/types';

export function Process({ steps }: { steps: ProcessStep[] }) {
  if (steps.length === 0) return null;

  return (
    <section id="process" className="section scroll-mt-24 border-t border-line">
      <div className="shell">
        <SectionHeading
          eyebrow="Process"
          title="Brief to delivery, five steps"
          lead="No mystery in the middle. Here is exactly what happens, what I need from you at each point, and roughly how long it takes."
        />

        <div className="relative mt-12 lg:mt-14">
          {/* ── Rail ─────────────────────────────────────────────────────────
              Fades at both ends so it does not appear to be cut off. Sits at
              left-5 on mobile and left-6 from sm, matching the numeral centres. */}
          <div
            className="absolute bottom-8 left-5 top-3 w-px bg-gradient-to-b from-transparent via-line-strong to-transparent sm:left-6"
            aria-hidden="true"
          />

          <RevealGroup as="ol" className="space-y-8 sm:space-y-10" stagger={0.09}>
            {steps.map((step) => (
              <RevealItem key={step.order} as="li" className="relative pl-14 sm:pl-[4.5rem]">
                {/* ── Numeral ──────────────────────────────────────────────── */}
                <span
                  className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-gold/35 bg-canvas font-display text-sm font-semibold text-gold-ink sm:h-12 sm:w-12 sm:text-base"
                  aria-hidden="true"
                >
                  {String(step.order).padStart(2, '0')}
                </span>

                <div className="pt-1 sm:pt-2">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="text-display-sm text-ink">{step.title}</h3>
                    <span className="inline-flex items-center gap-1.5 rounded-pill border border-line px-2.5 py-0.5 text-xs font-medium text-ink-muted">
                      <Clock className="h-3 w-3" aria-hidden="true" />
                      {step.duration}
                    </span>
                  </div>

                  <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-ink-soft sm:text-base">
                    {step.description}
                  </p>

                  {step.clientAction && (
                    <p className="mt-3.5 flex max-w-2xl gap-2.5 rounded-xl border border-gold/25 bg-gold/[0.06] px-4 py-3 text-sm leading-relaxed text-ink-soft">
                      <UserCheck
                        className="mt-0.5 h-4 w-4 shrink-0 text-gold-ink"
                        aria-hidden="true"
                      />
                      <span>
                        <span className="font-medium text-ink">What I need from you: </span>
                        {step.clientAction}
                      </span>
                    </p>
                  )}
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        <Reveal className="mt-12" delay={0.1}>
          <a href="#contact" className="btn-primary group">
            Start at step one
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
