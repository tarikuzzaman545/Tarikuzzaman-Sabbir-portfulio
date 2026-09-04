/**
 * Closing CTA banner for the home page.
 *
 * A server component. One job: after the visitor has seen the work and the
 * services, give them a single, unmissable way to start a conversation. It links
 * to /contact rather than embedding the form, because the home page should end
 * with a clear next step, not a long form the visitor has to complete in place.
 */

import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

import { Reveal } from '@/components/ui/Reveal';
import { siteConfig } from '@/site.config';

export function CtaBanner() {
  return (
    <section className="section border-t border-line">
      <div className="shell">
        <Reveal>
          <div className="grain relative isolate overflow-hidden rounded-card border border-gold/25 bg-gold/[0.06] px-6 py-14 text-center sm:px-12 sm:py-16 lg:py-20">
            <span className="inline-flex items-center gap-2 rounded-pill border border-gold/30 bg-canvas/70 px-3.5 py-1.5 text-xs font-medium text-gold-ink backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              {siteConfig.availability}
            </span>

            <h2 className="mx-auto mt-6 max-w-2xl text-balance text-display-md text-ink">
              Have a catalog to shoot? Let&rsquo;s skip the studio.
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-body-lg text-ink-soft">
              Send a product link and a rough count. You get a fixed price, a turnaround date, and a
              free sample before you commit to the batch.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link href="/contact" className="btn-gold group">
                Start a project
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
              <Link href="/work" className="btn-outline">
                See the work first
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
