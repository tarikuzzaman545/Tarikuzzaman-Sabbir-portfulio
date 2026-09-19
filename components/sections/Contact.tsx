/**
 * Contact section.
 *
 * Server component wrapping the one client island (`ContactForm`). The form is
 * interactive; the panel of direct links beside it is not, so it stays on the
 * server and ships no JavaScript.
 *
 * WHY THE DIRECT LINKS SIT NEXT TO THE FORM
 * ─────────────────────────────────────────
 * Some people will not fill in a form, ever — particularly agency buyers who
 * want to forward a thread to a colleague. Making them hunt through the footer
 * for an email address loses the enquiry. Both routes are offered at equal
 * weight, and the form is not presented as the only way in.
 *
 * PLACEHOLDER HANDLING
 * ────────────────────
 * Every contact detail passes through `isPlaceholder()` before it renders. A
 * FILL_ME value produces nothing rather than a dead `mailto:FILL_ME` link — a
 * broken contact link on a portfolio is worse than a missing one, because the
 * visitor thinks they have made contact and never hears back. When nothing has
 * been filled in yet, a build-time note appears in the panel instead so the
 * omission is obvious to whoever is setting the site up.
 */

import Link from 'next/link';
import { ArrowRight, Calendar, Clock, Mail, MapPin, MessageSquare, Phone, Sparkles } from 'lucide-react';

import { ContactForm } from '@/components/forms/ContactForm';
import { Reveal, SectionHeading } from '@/components/ui/Reveal';
import { activeSocials, isPlaceholder, siteConfig } from '@/site.config';

/** Labels for the social keys that belong in the contact panel. */
const CHANNEL_LABELS: Record<string, { label: string; detail: string }> = {
  upwork: { label: 'Upwork', detail: 'Hire with contract protection' },
  linkedin: { label: 'LinkedIn', detail: 'Connect or message me' },
  behance: { label: 'Behance', detail: 'Longer-form case studies' },
  instagram: { label: 'Instagram', detail: 'Recent work, informally' },
  github: { label: 'GitHub', detail: 'Pipeline and tooling code' },
  x: { label: 'X', detail: 'Occasional process notes' },
};

export function Contact() {
  const emailReady = !isPlaceholder(siteConfig.contact.email);
  const phoneReady = !isPlaceholder(siteConfig.contact.phone);
  const whatsappReady = !isPlaceholder(siteConfig.contact.whatsapp);

  // Only the profiles worth surfacing here, in a deliberate order — Upwork and
  // LinkedIn are the two that carry buying signal.
  const channels = activeSocials()
    .filter((social) => CHANNEL_LABELS[social.key] !== undefined)
    .sort((a, b) => {
      const order = ['upwork', 'linkedin', 'behance', 'instagram', 'github', 'x'];
      return order.indexOf(a.key) - order.indexOf(b.key);
    });

  const hasAnyDirectRoute = emailReady || phoneReady || whatsappReady || channels.length > 0;

  return (
    <section id="contact" className="section scroll-mt-24 border-t border-line">
      <div className="shell">
        <SectionHeading
          eyebrow="Contact"
          title="Tell me what you are shooting"
          lead="A product link and a rough count is enough to start. I will come back with a fixed price, a turnaround date, and a sample before you commit to the batch."
        />

        <div className="mt-12 grid gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-14">
          {/* ── Form ───────────────────────────────────────────────────────── */}
          <Reveal className="lg:col-span-7">
            <div className="card p-6 sm:p-8">
              <ContactForm />
            </div>
          </Reveal>

          {/* ── Direct routes & Book a Call ───────────────────────────────── */}
          <Reveal className="lg:col-span-5" delay={0.1}>
            <div className="space-y-8">
              {/* Featured Book a Call Card */}
              <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-[#061C12] via-[#04140D] to-[#020805] p-6 shadow-[0_12px_36px_rgba(0,0,0,0.6)] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                  <Calendar className="w-24 h-24 text-[#00F59B]" />
                </div>
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-mono uppercase tracking-wider text-[#00F59B] mb-3">
                    <Sparkles className="w-3 h-3" />
                    <span>Live 1-on-1 Consultation</span>
                  </div>
                  <h4 className="text-lg sm:text-xl font-display font-extrabold text-white mb-2 leading-tight">
                    Book a Strategy Call
                  </h4>
                  <p className="text-xs text-slate-300 mb-5 leading-relaxed">
                    Pick a 15-minute slot directly on my calendar. We will evaluate your product category, lighting angles, and turnaround time.
                  </p>
                  <Link
                    href="/book"
                    className="btn-neon inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black transition-all shadow-[0_0_20px_rgba(0,245,155,0.35)]"
                  >
                    <span>Choose Date & Time</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {hasAnyDirectRoute && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-ink">
                    Or reach me directly
                  </h3>

                  <ul className="mt-4 space-y-2.5">
                    {emailReady && (
                      <ChannelRow
                        href={`mailto:${siteConfig.contact.email}`}
                        icon={<Mail className="h-4 w-4" aria-hidden="true" />}
                        label="Email"
                        detail={siteConfig.contact.email}
                      />
                    )}

                    {whatsappReady && (
                      <ChannelRow
                        href={`https://wa.me/${siteConfig.contact.whatsapp}`}
                        external
                        icon={<MessageSquare className="h-4 w-4" aria-hidden="true" />}
                        label="WhatsApp"
                        detail="Quick questions, voice notes welcome"
                      />
                    )}

                    {phoneReady && (
                      <ChannelRow
                        href={`tel:${siteConfig.contact.phone.replace(/[^\d+]/g, '')}`}
                        icon={<Phone className="h-4 w-4" aria-hidden="true" />}
                        label="Phone"
                        detail={siteConfig.contact.phone}
                      />
                    )}

                    {channels.map((channel) => {
                      const meta = CHANNEL_LABELS[channel.key];
                      if (!meta) return null;
                      return (
                        <ChannelRow
                          key={channel.key}
                          href={channel.url}
                          external
                          icon={<span className="text-[0.7rem] font-bold">{meta.label.charAt(0)}</span>}
                          label={meta.label}
                          detail={meta.detail}
                        />
                      );
                    })}
                  </ul>
                </div>
              )}

              {!hasAnyDirectRoute && (
                // Visible only while site.config.ts still holds FILL_ME values.
                <div className="rounded-xl border border-dashed border-line-strong px-4 py-3.5 text-sm leading-relaxed text-ink-muted">
                  Direct contact links appear here once{' '}
                  <code className="font-mono text-xs text-ink-soft">site.config.ts</code> has your
                  email and profile URLs. The form above already works.
                </div>
              )}

              {/* ── Working expectations ─────────────────────────────────────
                  Answering these three questions before they are asked removes
                  the most common reason a first message never gets sent. */}
              <div className="card p-6">
                <h3 className="text-sm font-semibold text-ink">What to expect</h3>
                <dl className="mt-4 space-y-4 text-sm">
                  <div className="flex gap-3">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold-ink" aria-hidden="true" />
                    <div>
                      <dt className="font-medium text-ink">Reply within one working day</dt>
                      <dd className="mt-0.5 leading-relaxed text-ink-muted">
                        Usually the same day if you write before 6pm {siteConfig.timezone.split('/')[1]}
                        {' '}time.
                      </dd>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-ink" aria-hidden="true" />
                    <div>
                      <dt className="font-medium text-ink">{siteConfig.location}</dt>
                      <dd className="mt-0.5 leading-relaxed text-ink-muted">
                        Working remotely with brands across US, EU and AU timezones. Async by
                        default.
                      </dd>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <MessageSquare
                      className="mt-0.5 h-4 w-4 shrink-0 text-gold-ink"
                      aria-hidden="true"
                    />
                    <div>
                      <dt className="font-medium text-ink">A free sample first</dt>
                      <dd className="mt-0.5 leading-relaxed text-ink-muted">
                        One product, one full angle set, before any money moves. If the look is
                        wrong, we adjust the prompt or you walk away.
                      </dd>
                    </div>
                  </div>
                </dl>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ── Row ──────────────────────────────────────────────────────────────────── */

function ChannelRow({
  href,
  icon,
  label,
  detail,
  external = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  detail: string;
  external?: boolean;
}) {
  return (
    <li>
      <a
        href={href}
        {...(external
          ? // noopener strips the opener reference; noreferrer stops the Referer
            // header leaking which page linked out.
            { target: '_blank', rel: 'noopener noreferrer' }
          : {})}
        className="group flex items-center gap-3.5 rounded-xl border border-line bg-surface px-4 py-3 transition-colors duration-200 hover:border-gold/45"
      >
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/[0.08] text-gold-ink"
          aria-hidden="true"
        >
          {icon}
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-medium text-ink">
            {label}
            {external && <span className="sr-only"> (opens in a new tab)</span>}
          </span>
          <span className="block truncate text-xs text-ink-muted">{detail}</span>
        </span>
      </a>
    </li>
  );
}
