/**
 * Services preview — the home page's compact overview.
 *
 * A server component. This is the short version of the /services page: each
 * service reduced to its icon, name and one-line description, with a single link
 * through to the full page where the deliverables, pricing and process live. It
 * exists to tell a first-time visitor what is on offer without making them read
 * the whole services page to find out.
 */

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { Icon } from '@/components/ui/Icon';
import { RevealGroup, RevealItem, SectionHeading } from '@/components/ui/Reveal';
import type { Service } from '@/lib/content/types';

export function ServicesPreview({ services }: { services: Service[] }) {
  if (services.length === 0) return null;

  // Four reads as a complete set at a glance; more would turn the "overview"
  // into the full grid the /services page already is.
  const shown = services.slice(0, 4);

  return (
    <section className="section border-t border-line">
      <div className="shell">
        <SectionHeading
          eyebrow="Services"
          title="What I can build for you"
          lead="Four lanes of work, all built on one idea: a repeatable system beats a lucky output."
        />

        <RevealGroup
          as="ul"
          className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12"
          stagger={0.06}
        >
          {shown.map((service) => (
            <RevealItem key={service.slug} as="li">
              <Link
                href="/services"
                className="card-interactive group flex h-full items-start gap-4 p-5 lg:p-6"
              >
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gold/25 bg-gold/[0.08] text-gold-ink transition-colors duration-300 group-hover:border-gold/50 group-hover:bg-gold/[0.14]">
                  <Icon name={service.icon} className="h-[1.15rem] w-[1.15rem]" />
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-1.5 text-base font-semibold text-ink transition-colors group-hover:text-gold-ink">
                    {service.title}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-ink-soft">
                    {service.description}
                  </span>
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>

        <Link href="/services" className="btn-primary group mt-8">
          Explore services &amp; pricing
          <ArrowRight
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>
    </section>
  );
}
