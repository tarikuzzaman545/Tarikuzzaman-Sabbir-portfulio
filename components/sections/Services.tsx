/**
 * Services card grid.
 *
 * Server component — the only motion is the shared Reveal wrapper, which is its
 * own client island. The cards themselves are static HTML.
 *
 * The grid is `sm:grid-cols-2 lg:grid-cols-3` rather than an auto-fit minmax
 * track, because auto-fit with six items produces an orphan row of one at
 * certain widths. Explicit breakpoints give 1 / 2 / 3 columns, which divides six
 * cleanly at every size.
 */

import { Check } from 'lucide-react';

import { Reveal, RevealGroup, RevealItem, SectionHeading } from '@/components/ui/Reveal';
import { Icon } from '@/components/ui/Icon';
import type { Service } from '@/lib/content/types';

export function Services({ services }: { services: Service[] }) {
  if (services.length === 0) return null;

  return (
    <section id="services" className="section scroll-mt-24">
      <div className="shell">
        <SectionHeading
          eyebrow="Services"
          title="What I actually deliver"
          lead="Four lanes of work, all built on the same idea: a repeatable system beats a lucky output. Every engagement leaves you with something you can run again."
        />

        <RevealGroup
          as="ul"
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3"
          stagger={0.06}
        >
          {services.map((service) => (
            <RevealItem key={service.slug} as="li" className="flex">
              <article className="card-interactive group flex w-full flex-col p-6 lg:p-7">
                {/* ── Icon ─────────────────────────────────────────────── */}
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-gold/25 bg-gold/[0.08] text-gold-ink transition-colors duration-300 group-hover:border-gold/50 group-hover:bg-gold/[0.14]">
                  <Icon name={service.icon} className="h-[1.15rem] w-[1.15rem]" />
                </span>

                <h3 className="mt-5 text-display-sm text-ink">{service.title}</h3>

                <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">
                  {service.description}
                </p>

                {/* ── Includes ─────────────────────────────────────────── */}
                <ul className="mt-5 space-y-2.5">
                  {service.includes.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-ink-soft">
                      <Check
                        className="mt-[0.3rem] h-3.5 w-3.5 shrink-0 text-gold"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {/* ── Footer meta ──────────────────────────────────────────
                    mt-auto pins this to the bottom so the price line sits on
                    the same baseline across cards of differing height. */}
                <dl className="mt-auto flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t border-line pt-5 text-sm">
                  <div className="pt-5 first:pt-0 sm:pt-0">
                    <dt className="text-xs uppercase tracking-[0.1em] text-ink-muted">From</dt>
                    <dd className="mt-0.5 font-medium text-ink">
                      {service.startingAt ?? 'On request'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.1em] text-ink-muted">
                      Turnaround
                    </dt>
                    <dd className="mt-0.5 font-medium text-ink">{service.turnaround}</dd>
                  </div>
                </dl>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-10" delay={0.1}>
          <p className="text-sm text-ink-muted">
            Not sure which of these fits?{' '}
            <a href="#contact" className="link-underline font-medium">
              Describe the problem
            </a>{' '}
            and I will tell you honestly whether I am the right person for it.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
