'use client';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  CTA BANNER — "READY TO CREATE SOMETHING AMAZING?"
 * ─────────────────────────────────────────────────────────────────────────────
 */

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import { homeContent } from '@/data/homeContent';

export function CtaBanner() {
  const { ctaBanner } = homeContent;

  return (
    <section className="relative py-16 sm:py-24 overflow-hidden">
      <div className="shell">
        <div className="relative liquid-glass-card rounded-3xl p-8 sm:p-12 lg:p-16 border border-emerald-500/30 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
          {/* Ambient background glow orb inside banner */}
          <div
            className="pointer-events-none absolute -right-20 -bottom-20 h-[350px] w-[350px] rounded-full bg-emerald-500/25 blur-[100px] -z-10"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                {ctaBanner.title}
              </h2>
              <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-xl">
                {ctaBanner.subtitle}
              </p>
            </div>

            {/* Right Action & Avatars & Doodle */}
            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-row items-start sm:items-center lg:justify-end gap-6 relative">
              {/* Button */}
              <Link
                href={ctaBanner.button.href}
                className="btn-neon inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-bold uppercase tracking-wider text-black transition-all"
              >
                {ctaBanner.button.label}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>

              {/* Avatar Stack */}
              <div className="flex items-center -space-x-2.5">
                {ctaBanner.avatars.map((avatar, idx) => (
                  <div
                    key={idx}
                    className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-emerald-400/80 shadow-[0_0_10px_rgba(0,245,155,0.3)]"
                  >
                    <Image src={avatar} alt="Client" fill className="object-cover" />
                  </div>
                ))}
              </div>

              {/* Handwritten Doodle */}
              <div className="hidden sm:block absolute -top-10 -right-2 rotate-12 text-emerald-400 font-serif italic text-xs font-bold tracking-wider leading-tight select-none pointer-events-none text-right">
                Your Vision<br />
                My Creativity ✦
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
