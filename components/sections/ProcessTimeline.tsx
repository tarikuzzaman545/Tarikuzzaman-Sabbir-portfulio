'use client';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  MY PROCESS — 4 CONNECTED TIMELINE STEPS (MATCHING MOCKUP)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { ArrowRight, CheckCircle2, MessageSquare, Palette, Send, Sliders } from 'lucide-react';

import { homeContent } from '@/data/homeContent';

const STEP_ICONS = [MessageSquare, Sliders, Palette, Send];

export function ProcessTimeline() {
  const { processSection } = homeContent;

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      <div className="shell">
        {/* ── Section Header ────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full liquid-glass border border-emerald-500/30 px-3.5 py-1 text-xs font-semibold tracking-wider text-emerald-400 uppercase mb-4">
              {processSection.badge}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Simple. Clear. <br />
              <span className="text-gradient-neon">Effective.</span>
            </h2>
          </div>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-md md:text-right">
            {processSection.subtitle}
          </p>
        </div>

        {/* ── 4 Connected Process Cards ──────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {processSection.steps.map((step, idx) => {
            const Icon = STEP_ICONS[idx] || CheckCircle2;
            return (
              <div
                key={step.step}
                className="liquid-glass-card rounded-2xl p-6 relative flex flex-col justify-between transition-all duration-300 hover:border-emerald-400/60"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 shadow-[0_0_15px_rgba(0,245,155,0.2)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-2xl font-extrabold text-emerald-400/50 font-mono">
                      {step.step}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow connector between steps on desktop */}
                {idx < processSection.steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 text-emerald-400/70">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
