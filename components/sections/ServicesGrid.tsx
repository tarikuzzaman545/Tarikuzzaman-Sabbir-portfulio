'use client';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  WHAT I DO — 8 LIQUID GLASS SERVICES CARDS (MATCHING MOCKUP)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import { homeContent } from '@/data/homeContent';

export function ServicesGrid() {
  const { servicesSection } = homeContent;

  return (
    <section id="services" className="relative py-20 sm:py-28 overflow-hidden">
      <div className="shell">
        {/* ── Section Header ────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full liquid-glass border border-emerald-500/30 px-3.5 py-1 text-xs font-semibold tracking-wider text-emerald-400 uppercase mb-4">
              {servicesSection.badge}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Creative Solutions for <br />
              <span className="text-gradient-neon">Modern Brands.</span>
            </h2>
          </div>

          <div className="flex flex-col items-start md:items-end gap-4 max-w-md">
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed md:text-right">
              {servicesSection.subtitle}
            </p>
            <Link
              href={servicesSection.cta.href}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 hover:text-emerald-300 transition-colors border-b border-emerald-400/40 pb-0.5"
            >
              {servicesSection.cta.label}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* ── 8 Liquid Glass Service Cards Grid ─────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicesSection.services.map((service) => (
            <Link
              key={service.id}
              href={service.href}
              className="group liquid-glass-card rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:border-emerald-400/60"
            >
              {/* Image Frame with Liquid Glass & Glow */}
              <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#03150D] border border-emerald-500/20 mb-4 group-hover:border-emerald-400/40 transition-colors">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#04120A] via-transparent to-transparent opacity-60" />
                
                {service.tag && (
                  <div className="absolute top-2.5 left-2.5 rounded-full bg-black/60 backdrop-blur-md border border-emerald-400/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                    {service.tag}
                  </div>
                )}
              </div>

              {/* Title, Subtitle, & Arrow Button */}
              <div className="flex items-start justify-between gap-2 pt-1">
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">
                    {service.description}
                  </p>
                </div>

                <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-400 group-hover:bg-emerald-400 group-hover:text-black transition-all">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
