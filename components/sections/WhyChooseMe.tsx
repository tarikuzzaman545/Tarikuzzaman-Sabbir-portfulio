'use client';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  WHY BRANDS WORK WITH ME — 4 LIQUID GLASS FEATURE CARDS
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { Palette, ShieldCheck, Sparkles, Target, Zap } from 'lucide-react';

import { homeContent } from '@/data/homeContent';

const ICON_MAP = {
  palette: Palette,
  zap: Zap,
  target: Target,
  shieldCheck: ShieldCheck,
};

export function WhyChooseMe() {
  const { whyChooseMeSection } = homeContent;

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      <div className="shell">
        {/* ── Section Header with Doodle ─────────────────────────────────── */}
        <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full liquid-glass border border-emerald-500/30 px-3.5 py-1 text-xs font-semibold tracking-wider text-emerald-400 uppercase mb-4">
              {whyChooseMeSection.badge}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              More Than Just Images. <br />
              <span className="text-gradient-neon">A Partner in Your Growth.</span>
            </h2>
            <p className="mt-5 text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              {whyChooseMeSection.subtitle}
            </p>
          </div>

          {/* Handwritten Doodle on Right: "Let's Create Something Great! ✦" */}
          <div className="hidden md:block relative text-right pr-6">
            <div className="rotate-6 text-emerald-400 font-serif italic text-lg font-bold tracking-wider leading-snug select-none pointer-events-none">
              Let&apos;s<br />
              Create<br />
              Something<br />
              Great! ✦
            </div>
          </div>
        </div>

        {/* ── 4 Feature Cards Grid ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyChooseMeSection.features.map((feature, idx) => {
            const Icon = ICON_MAP[feature.icon as keyof typeof ICON_MAP] || Sparkles;
            return (
              <div
                key={idx}
                className="liquid-glass-card rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:border-emerald-400/60"
              >
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 mb-5 shadow-[0_0_15px_rgba(0,245,155,0.2)]">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">
                    {feature.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
