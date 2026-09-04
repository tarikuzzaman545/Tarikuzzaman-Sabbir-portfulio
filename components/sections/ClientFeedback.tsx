'use client';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  CLIENT FEEDBACK — 3 LIQUID GLASS TESTIMONIAL CARDS (MATCHING MOCKUP)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Star } from 'lucide-react';

import { homeContent } from '@/data/homeContent';

export function ClientFeedback() {
  const { testimonialsSection } = homeContent;

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      <div className="shell">
        {/* ── Section Header ────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full liquid-glass border border-emerald-500/30 px-3.5 py-1 text-xs font-semibold tracking-wider text-emerald-400 uppercase mb-4">
              {testimonialsSection.badge}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              What Clients <span className="text-gradient-neon">Say</span>
            </h2>
          </div>

          <Link
            href={testimonialsSection.cta.href}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 hover:text-emerald-300 transition-colors border-b border-emerald-400/40 pb-0.5"
          >
            {testimonialsSection.cta.label}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {/* ── 3 Testimonials Grid ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonialsSection.testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="liquid-glass-card rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:border-emerald-400/60"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1 mb-4 text-emerald-400">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-emerald-400 text-emerald-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
              </div>

              {/* Author & Avatar */}
              <div className="mt-6 pt-5 border-t border-emerald-500/15 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden border border-emerald-400/40 shadow-[0_0_10px_rgba(0,245,155,0.2)]">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {testimonial.author}
                    </h3>
                    <p className="text-[11px] text-emerald-400/80 font-medium">
                      {testimonial.role}
                    </p>
                  </div>
                </div>

                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-400/30">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
