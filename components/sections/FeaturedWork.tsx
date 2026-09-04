'use client';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  FEATURED WORK — 5 SHOWCASE CARDS WITH REAL PRODUCTS & CATEGORIES
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import { homeContent } from '@/data/homeContent';
import { cn } from '@/lib/utils';

export function FeaturedWork() {
  const { featuredWorkSection } = homeContent;
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProjects =
    activeCategory === 'All'
      ? featuredWorkSection.projects
      : featuredWorkSection.projects.filter(
          (p) => p.category.toLowerCase() === activeCategory.toLowerCase(),
        );

  return (
    <section id="work" className="relative py-20 sm:py-28 overflow-hidden">
      <div className="shell">
        {/* ── Section Header ────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full liquid-glass border border-emerald-500/30 px-3.5 py-1 text-xs font-semibold tracking-wider text-emerald-400 uppercase mb-4">
              {featuredWorkSection.badge}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Real Products. <br />
              Real <span className="text-gradient-neon">Results.</span>
            </h2>
          </div>

          <div className="flex flex-col items-start md:items-end gap-4 max-w-md">
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed md:text-right">
              {featuredWorkSection.subtitle}
            </p>
            <Link
              href={featuredWorkSection.cta.href}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 hover:text-emerald-300 transition-colors border-b border-emerald-400/40 pb-0.5"
            >
              {featuredWorkSection.cta.label}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* ── Category Filter Pills ──────────────────────────────────────── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {featuredWorkSection.categories.map((cat) => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'flex-shrink-0 rounded-full px-5 py-2 text-xs font-bold transition-all duration-200',
                  active
                    ? 'bg-emerald-400 text-black shadow-[0_0_20px_rgba(0,245,155,0.4)] scale-105'
                    : 'liquid-glass text-slate-300 border border-emerald-500/25 hover:text-white hover:border-emerald-400/40',
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* ── 5 Showcase Cards Grid ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {filteredProjects.map((project) => (
            <Link
              key={project.id}
              href={project.href}
              className="group liquid-glass-card rounded-2xl p-3.5 flex flex-col justify-between transition-all duration-300 hover:border-emerald-400/60"
            >
              {/* Product Image Container */}
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#03140C] border border-emerald-500/20 mb-3.5">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#041009] via-transparent to-transparent opacity-50" />
              </div>

              {/* Title, Subtitle, & Arrow Button */}
              <div className="flex items-center justify-between gap-2">
                <div className="overflow-hidden">
                  <h3 className="text-sm font-bold text-white truncate group-hover:text-emerald-300 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {project.subtitle}
                  </p>
                </div>

                <div className="flex-shrink-0 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-400 group-hover:bg-emerald-400 group-hover:text-black transition-all">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
