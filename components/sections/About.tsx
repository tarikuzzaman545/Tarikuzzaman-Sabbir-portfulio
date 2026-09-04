/**
 * About.
 *
 * Server component, no motion beyond the shared Reveal wrappers.
 *
 * The layout is a 12-column split rather than a plain two-column grid so the
 * text column can be 7 wide and the credentials rail 5 — a 60/40 balance that
 * keeps the prose measure near 65 characters. An even 50/50 split at this
 * container width produces a line length that is uncomfortable to read.
 */

import { Building2, GraduationCap, MapPin } from 'lucide-react';

import { Reveal, SectionHeading } from '@/components/ui/Reveal';
import { siteConfig } from '@/site.config';

export function About() {
  return (
    <section id="about" className="section scroll-mt-24 border-t border-line">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* ── Narrative ─────────────────────────────────────────────────── */}
          <div className="lg:col-span-7">
            <SectionHeading eyebrow="About" title="Systems, not lucky renders" />

            <div className="mt-6 space-y-5 text-body-lg text-ink-soft">
              <Reveal delay={0.05}>
                <p>
                  I am a Computer Science &amp; Engineering student at{' '}
                  <span className="font-medium text-ink">{siteConfig.education.institution}</span> in{' '}
                  {siteConfig.location}, and I spend most of my working hours generating product
                  imagery for e-commerce brands. The CSE half is not incidental — it is why my work
                  is a pipeline rather than a folder of one-off outputs.
                </p>
              </Reveal>

              <Reveal delay={0.1}>
                <p>
                  Most AI image work falls apart at scale. A single beautiful frame is easy. Six
                  consistent angles of the same garment, on the same model, against the same
                  background hex, repeated across two hundred products — that is an engineering
                  problem. So I treat it as one: reference-locking, structural garment
                  descriptions, hex constraints, named shot conventions, and documented fixes for
                  every failure mode I have hit.
                </p>
              </Reveal>

              <Reveal delay={0.15}>
                <p>
                  My primary generation tool is{' '}
                  <span className="font-medium text-ink">Higgsfield</span>, with ComfyUI running
                  locally for batch work where I need more control over the pipeline. But the tool
                  matters far less than the constraint system around it, and the tools will change
                  again next year. The method is the deliverable.
                </p>
              </Reveal>

              <Reveal delay={0.2}>
                <p>
                  Alongside client work I co-founded{' '}
                  <span className="font-medium text-ink">{siteConfig.agency.name}</span>, an{' '}
                  {siteConfig.agency.description.toLowerCase().replace(/\.$/, '')}. Same principle,
                  applied to brands that need the whole visual system rather than a batch of images.
                </p>
              </Reveal>
            </div>
          </div>

          {/* ── Credentials rail ──────────────────────────────────────────── */}
          <Reveal className="lg:col-span-5" delay={0.12} direction="left">
            <div className="card p-6 lg:p-7">
              <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
                At a glance
              </h3>

              <dl className="mt-5 space-y-5">
                {[
                  {
                    icon: <GraduationCap className="h-4 w-4" aria-hidden="true" />,
                    term: siteConfig.education.degree,
                    detail: `${siteConfig.education.institutionFull} · ${siteConfig.education.status}`,
                  },
                  {
                    icon: <Building2 className="h-4 w-4" aria-hidden="true" />,
                    term: `${siteConfig.agency.role}, ${siteConfig.agency.name}`,
                    detail: siteConfig.agency.description,
                  },
                  {
                    icon: <MapPin className="h-4 w-4" aria-hidden="true" />,
                    term: siteConfig.location,
                    detail: `Working ${siteConfig.timezone.replace('/', ' / ')} · comfortable across EU and US hours`,
                  },
                ].map((item) => (
                  <div key={item.term} className="flex gap-3.5">
                    <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-line text-gold-ink">
                      {item.icon}
                    </span>
                    <div>
                      <dt className="text-sm font-medium leading-snug text-ink">{item.term}</dt>
                      <dd className="mt-1 text-sm leading-relaxed text-ink-muted">{item.detail}</dd>
                    </div>
                  </div>
                ))}
              </dl>

              {/* ── Working principles ──────────────────────────────────── */}
              <div className="mt-7 border-t border-line pt-6">
                <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
                  How I work
                </h4>
                <ul className="mt-4 space-y-3">
                  {[
                    'Spec locked before generation starts, so revisions are corrections rather than guesses',
                    'A failed shot gets flagged, not forced through with a bad hand',
                    'Filenames and folders match your ingest process, not mine',
                    'The prompt system is handed over — you are not locked to me',
                  ].map((principle) => (
                    <li key={principle} className="flex gap-2.5 text-sm leading-relaxed text-ink-soft">
                      <span
                        className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-gold"
                        aria-hidden="true"
                      />
                      <span>{principle}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
