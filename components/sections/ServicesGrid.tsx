'use client';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  WHAT I DO — 6 TALL LIQUID GLASS SERVICES CARDS
 *  EXACT 1:1 MATCH TO media_1788528918575.png
 * ─────────────────────────────────────────────────────────────────────────────
 */

import Link from 'next/link';
import {
  ArrowUpRight,
  Camera,
  Monitor,
  PenTool,
  Sparkles,
  User,
  Video,
} from 'lucide-react';

import { homeContent } from '@/data/homeContent';

const SERVICE_ICONS: Record<string, typeof Camera> = {
  camera: Camera,
  user: User,
  video: Video,
  pen: PenTool,
  monitor: Monitor,
  prompt: Sparkles,
};

export function ServicesGrid() {
  const { servicesSection } = homeContent;

  return (
    <section id="services" className="relative pt-6 sm:pt-10 pb-20 sm:pb-28 overflow-hidden">
      {/* Ambient background glow */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-emerald-500/10 blur-[140px] -z-10"
        aria-hidden="true"
      />

      <div className="shell">
        {/* ── Section Header ────────────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 sm:mb-16">
          <div className="max-w-2xl">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full liquid-glass border border-emerald-500/30 px-3.5 py-1 text-[11px] font-semibold tracking-wider text-emerald-400 uppercase mb-4 shadow-[0_0_15px_rgba(0,230,118,0.15)]">
              {servicesSection.badge}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.12]">
              Creative Solutions <br />
              for Modern Brands.
            </h2>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-5 max-w-lg">
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed lg:text-right">
              {servicesSection.subtitle}
            </p>
            <Link
              href={servicesSection.cta.href}
              className="inline-flex items-center gap-2 rounded-full liquid-glass border border-emerald-500/30 bg-[#040D09]/60 px-5 py-2.5 text-xs font-semibold text-white hover:border-[#00E676] hover:text-[#00E676] transition-all shadow-[0_0_20px_rgba(0,230,118,0.15)]"
            >
              {servicesSection.cta.label}
              <ArrowUpRight className="h-3.5 w-3.5 text-[#00E676]" />
            </Link>
          </div>
        </div>

        {/* ── 6 Tall Liquid Glass Service Cards Grid ─────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-4.5 lg:gap-5">
          {servicesSection.services.map((service) => {
            const IconComponent = SERVICE_ICONS[service.icon ?? ''] || Camera;

            return (
              <Link
                key={service.id}
                href={service.href}
                className="group relative rounded-2xl sm:rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 min-h-[310px] sm:min-h-[330px] border border-emerald-500/25 bg-[#05140D]/70 backdrop-blur-xl hover:border-[#00E676]/60 hover:-translate-y-1.5 hover:shadow-[0_15px_35px_rgba(0,230,118,0.18)] overflow-hidden"
              >
                {/* Subtle top inner gradient highlight */}
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-b from-emerald-400/[0.08] via-transparent to-transparent -z-10"
                  aria-hidden="true"
                />

                {/* Top: Clean Line Icon with Emerald Stroke */}
                <div>
                  <div className="inline-flex items-center justify-center text-[#00E676] transition-transform duration-300 group-hover:scale-110">
                    <IconComponent className="h-8 w-8 stroke-[1.5]" />
                  </div>

                  {/* Middle: Title & Description */}
                  <h3 className="text-[15px] sm:text-base font-bold text-white tracking-tight leading-snug mt-6 sm:mt-7 group-hover:text-emerald-300 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mt-2.5 line-clamp-3">
                    {service.description}
                  </p>
                </div>

                {/* Bottom: Glowing Circular Action Button with ↗ */}
                <div className="mt-8 pt-4 flex items-center">
                  <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-400/30 text-[#00E676] group-hover:bg-[#00E676] group-hover:text-black group-hover:border-[#00E676] transition-all shadow-[0_0_15px_rgba(0,230,118,0.25)]">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
