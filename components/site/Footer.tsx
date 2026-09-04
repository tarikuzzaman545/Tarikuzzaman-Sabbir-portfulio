/**
 * Site footer — socials, quick nav, newsletter, copyright.
 *
 * A server component. The only interactive piece is the newsletter form, which
 * is its own client island, so the rest of the footer ships zero JavaScript.
 *
 * Placeholder links are filtered out rather than rendered dead. `activeSocials()`
 * drops anything still set to FILL_ME, which means a half-configured deploy shows
 * a shorter footer instead of a row of links that 404.
 */

import { Github, Instagram, Linkedin, Mail, MapPin, Twitter } from 'lucide-react';
import Link from 'next/link';

import { NewsletterForm } from '@/components/forms/NewsletterForm';
import { activeSocials, isPlaceholder, siteConfig } from '@/site.config';

/** Upwork has no lucide glyph, so it gets a small inline wordmark instead. */
function UpworkGlyph() {
  return (
    <span className="text-[0.7rem] font-bold tracking-tight" aria-hidden="true">
      Up
    </span>
  );
}

const SOCIAL_META: Record<string, { label: string; icon: React.ReactNode }> = {
  upwork: { label: 'Upwork', icon: <UpworkGlyph /> },
  linkedin: { label: 'LinkedIn', icon: <Linkedin className="h-4 w-4" aria-hidden="true" /> },
  github: { label: 'GitHub', icon: <Github className="h-4 w-4" aria-hidden="true" /> },
  instagram: { label: 'Instagram', icon: <Instagram className="h-4 w-4" aria-hidden="true" /> },
  behance: { label: 'Behance', icon: <span className="text-[0.7rem] font-bold">Bē</span> },
  x: { label: 'X', icon: <Twitter className="h-4 w-4" aria-hidden="true" /> },
};

export function Footer() {
  const socials = activeSocials();
  const email = siteConfig.contact.email;
  const hasEmail = !isPlaceholder(email);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-surface">
      <div className="shell py-14 lg:py-16">
        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
          {/* ── Identity ─────────────────────────────────────────────────── */}
          <div className="md:col-span-5">
            <Link href="/" className="inline-flex items-baseline gap-2">
              <span className="font-display text-xl font-semibold text-ink">
                {siteConfig.name}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
            </Link>

            <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-soft">
              {siteConfig.role}. {siteConfig.tagline}
            </p>

            <p className="mt-4 flex items-center gap-2 text-sm text-ink-muted">
              <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
              {siteConfig.location}
            </p>

            {hasEmail && (
              <a
                href={`mailto:${email}`}
                className="mt-2 inline-flex items-center gap-2 text-sm text-ink-soft transition-colors hover:text-gold-ink"
              >
                <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                {email}
              </a>
            )}
          </div>

          {/* ── Quick nav ────────────────────────────────────────────────── */}
          <nav aria-label="Footer navigation" className="md:col-span-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
              Navigate
            </h2>
            <ul className="mt-4 space-y-2.5">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-ink-soft transition-colors hover:text-gold-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* ── Newsletter ───────────────────────────────────────────────── */}
          <div className="md:col-span-4">
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
              Occasional notes
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">
              Prompt techniques and pipeline notes from real client work. No schedule, no filler.
            </p>
            <NewsletterForm className="mt-4" />
          </div>
        </div>

        {/* ── Bottom bar ─────────────────────────────────────────────────── */}
        <div className="mt-12 flex flex-col-reverse items-start justify-between gap-6 border-t border-line pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-ink-muted">
            © {year} {siteConfig.name}. All rights reserved.
          </p>

          {socials.length > 0 && (
            <ul className="flex items-center gap-2">
              {socials.map(({ key, url }) => {
                const meta = SOCIAL_META[key];
                if (!meta) return null;
                return (
                  <li key={key}>
                    <a
                      href={url}
                      target="_blank"
                      // noopener closes the window.opener hole; noreferrer stops
                      // the referrer leaking. Both, always, on external targets.
                      rel="noopener noreferrer"
                      aria-label={`${meta.label} (opens in a new tab)`}
                      title={meta.label}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-pill border border-line text-ink-soft transition-colors hover:border-gold/50 hover:text-gold-ink"
                    >
                      {meta.icon}
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
}
