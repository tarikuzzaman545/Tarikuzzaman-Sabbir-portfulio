/**
 * Hero.
 *
 * A server component. The animated background motif is its own client island so
 * this section's text — the LCP element — is in the initial HTML with no
 * JavaScript required to paint it. Getting the headline into the first byte of
 * HTML is the single biggest lever on mobile LCP, so nothing here waits on
 * hydration.
 */

import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

import { HeroMotif } from '@/components/sections/HeroMotif';
import { siteConfig } from '@/site.config';

export function Hero() {
  return (
    <section
      id="hero"
      // `isolate` creates a stacking context so the motif's absolute children
      // cannot escape above the fixed header.
      className="grain relative isolate overflow-hidden pb-20 pt-32 sm:pb-28 sm:pt-40 lg:pb-32 lg:pt-44"
    >
      <HeroMotif />

      <div className="shell relative">
        <div className="max-w-4xl">
          {/* ── Availability pill ────────────────────────────────────────── */}
          <div className="inline-flex items-center gap-2.5 rounded-pill border border-line bg-surface/70 py-1.5 pl-2.5 pr-4 text-xs font-medium text-ink-soft backdrop-blur-sm">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-success" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            {siteConfig.availability}
          </div>

          {/* ── Headline ─────────────────────────────────────────────────── */}
          <h1 className="mt-6 text-display-xl text-ink">
            Product photography
            <br />
            {/* The gradient sits on its own span so the fallback colour on the
                h1 still applies if background-clip: text is unsupported. */}
            <span className="text-gradient-gold">without the studio.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-body-lg text-ink-soft">{siteConfig.valueProp}</p>

          {/* ── Identity line ────────────────────────────────────────────── */}
          <p className="mt-5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm text-ink-muted">
            <span className="font-medium text-ink">{siteConfig.name}</span>
            <span aria-hidden="true">·</span>
            <span>{siteConfig.role}</span>
            <span aria-hidden="true">·</span>
            <span>{siteConfig.location}</span>
          </p>

          {/* ── CTAs ─────────────────────────────────────────────────────── */}
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link href="/contact" className="btn-gold group">
              Hire me
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
            <Link href="/work" className="btn-outline group">
              <Sparkles className="h-4 w-4 text-gold" aria-hidden="true" />
              View work
            </Link>
          </div>

          {/* ── Stats ────────────────────────────────────────────────────── */}
          {/* A dl is the correct element here: each stat is a term and its
              value, not a list of unrelated items. */}
          <dl className="mt-14 grid max-w-2xl grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
            {siteConfig.stats.map((stat) => (
              <div key={stat.label} className="border-l border-line pl-4">
                <dd className="font-display text-2xl font-semibold text-ink sm:text-3xl">
                  {stat.value}
                </dd>
                <dt className="mt-1 text-xs uppercase tracking-[0.1em] text-ink-muted">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
