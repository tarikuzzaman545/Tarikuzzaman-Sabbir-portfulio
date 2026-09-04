'use client';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  HERO SECTION — EXACT 1:1 REPLICA OF THE UPLOADED MOCKUP (media_1788527803084.jpg)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  Features:
 *  - Full atmospheric environment with glowing emerald ambient aura
 *  - Sabbir's photo naturally blended into the scene (no box border!)
 *  - Floating liquid glass cards ("Turning Products Into Best Sellers", "Based in Khulna")
 *  - Handwritten doodles ("Ideas Designs Reality", "Better Visuals Brighter Brands")
 *  - High-converting CTA buttons & 5 social icon bubbles
 *  - Bottom stats container with circular icons and 6 trusted brand partner logos
 *  - Animated scroll down mouse indicator & bottom left tagline
 */

import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowUpRight,
  Award,
  CheckCircle2,
  Facebook,
  Instagram,
  Linkedin,
  MapPin,
  Play,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';

import { homeContent } from '@/data/homeContent';

export function Hero() {
  const { hero } = homeContent;

  return (
    <section className="relative pt-24 pb-6 sm:pt-32 sm:pb-8 overflow-hidden">
      {/* ── Ambient Radial Emerald Glows Behind Hero ───────────────────── */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-[650px] w-[900px] rounded-full bg-emerald-500/15 blur-[140px] -z-10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-48 right-0 h-[450px] w-[500px] rounded-full bg-emerald-400/10 blur-[120px] -z-10"
        aria-hidden="true"
      />

      <div className="shell">
        {/* ── Main Hero Grid: Left Content + Right Visual ───────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* ── Left Column (Text & CTAs) ───────────────────────────────── */}
          <div className="lg:col-span-6 z-10">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full liquid-glass border border-emerald-500/30 px-4 py-1.5 shadow-[0_0_20px_rgba(0,245,155,0.15)] mb-6">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E676] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00E676]" />
              </span>
              <span className="text-xs font-semibold tracking-wide text-emerald-300">
                {hero.badge}
              </span>
            </div>

            {/* Headline with Doodle */}
            <div className="relative">
              <h1 className="text-4xl sm:text-5xl lg:text-[4rem] font-extrabold tracking-tight text-white leading-[1.06]">
                {hero.titleStart} <br />
                <span className="text-gradient-neon">{hero.titleHighlight}</span>
              </h1>

              {/* Handwritten Doodle "Ideas Designs Reality" */}
              <div className="hidden sm:block absolute -top-8 right-12 lg:-right-2 rotate-6 text-[#00E676] font-serif italic text-sm font-bold tracking-wider leading-snug select-none pointer-events-none">
                <span>Ideas</span><br />
                <span className="ml-2">Designs</span><br />
                <span className="ml-4">Reality</span>
              </div>
            </div>

            {/* Subtitle / Bio Description */}
            <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
              I’m <strong className="text-white font-semibold">Tarikuzzaman Sabbir</strong>, an AI
              product photographer and creative designer. I help brands create stunning product
              visuals, model shoots, ads and marketing content that look premium and drive real
              results.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href={hero.ctaPrimary.href}
                className="btn-neon inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-black transition-all shadow-[0_0_25px_rgba(0,230,118,0.4)]"
              >
                {hero.ctaPrimary.label}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>

              <a
                href={hero.ctaSecondary.href}
                className="liquid-glass inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-white border border-emerald-500/30 hover:border-emerald-400/60 hover:bg-emerald-500/10 transition-all"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00E676] text-black">
                  <Play className="h-3 w-3 fill-black ml-0.5" />
                </div>
                {hero.ctaSecondary.label}
              </a>
            </div>

            {/* Social Connect Row */}
            <div className="mt-10 flex flex-wrap items-center gap-4 pt-6 border-t border-emerald-500/15">
              <div className="flex items-center gap-2">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full liquid-glass border border-emerald-500/25 text-slate-300 hover:text-[#00E676] hover:border-emerald-400/50 transition-all"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full liquid-glass border border-emerald-500/25 text-slate-300 hover:text-[#00E676] hover:border-emerald-400/50 transition-all"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full liquid-glass border border-emerald-500/25 text-slate-300 hover:text-[#00E676] hover:border-emerald-400/50 transition-all"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="X Twitter"
                  className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full liquid-glass border border-emerald-500/25 text-slate-300 hover:text-[#00E676] hover:border-emerald-400/50 transition-all font-bold text-xs"
                >
                  𝕏
                </a>
                <a
                  href="https://pinterest.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Pinterest"
                  className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full liquid-glass border border-emerald-500/25 text-slate-300 hover:text-[#00E676] hover:border-emerald-400/50 transition-all font-bold text-xs"
                >
                  P
                </a>
              </div>

              <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                {hero.connectLabel}
                <ArrowUpRight className="h-3 w-3 text-[#00E676]" />
              </span>
            </div>
          </div>

          {/* ── Right Column: Atmospheric Photo & Floating Glass Elements ── */}
          <div className="lg:col-span-6 relative">
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] lg:aspect-[1.12] overflow-visible">
              
              {/* Photo with Seamless Blended Edges (No boxed card border!) */}
              <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.85)]">
                <Image
                  src={hero.image}
                  alt="MD Tarikuzzaman Sabbir — AI Product Photographer & Creative Designer"
                  fill
                  priority
                  unoptimized
                  className="object-cover object-center lg:object-[center_30%]"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                />
                {/* Soft gradient blend masks matching the dark emerald page */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#040D09] via-transparent to-transparent opacity-85" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#040D09] via-transparent to-transparent opacity-75" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#040D09]/50 via-transparent to-transparent opacity-50" />
              </div>

              {/* Floating Glass Card 1 (Top Right) */}
              <div className="absolute -top-3 -right-2 sm:-right-4 liquid-glass-card rounded-2xl p-3.5 sm:p-4 max-w-[200px] shadow-[0_15px_35px_rgba(0,0,0,0.85)] z-20 border border-emerald-500/35">
                <div className="flex items-center justify-between mb-2">
                  <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 border border-emerald-400/30 p-1 shrink-0">
                    <Image
                      src="/img/brand/logo.png"
                      alt="Logo"
                      width={28}
                      height={28}
                      unoptimized
                      className="h-full w-full object-contain drop-shadow-[0_0_8px_rgba(0,230,118,0.6)]"
                    />
                  </div>
                  <div className="text-[#00E676] text-xs font-bold">✦ ✦</div>
                </div>
                <p className="text-xs font-bold text-white leading-tight">
                  {hero.cardTopRight.title}
                </p>
                <div className="mt-2.5 inline-flex items-center gap-1.5 text-[10px] text-emerald-300 font-semibold bg-emerald-500/15 px-2.5 py-1 rounded-full border border-emerald-400/25">
                  <TrendingUp className="h-3 w-3 text-[#00E676]" />
                  {hero.cardTopRight.tag}
                </div>
              </div>

              {/* Floating Glass Card 2 (Bottom Right) */}
              <div className="absolute bottom-4 -right-1 sm:-right-3 liquid-glass-card rounded-full px-4 py-2.5 flex items-center gap-2.5 shadow-[0_15px_35px_rgba(0,0,0,0.85)] z-20 border border-emerald-500/35">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 text-[#00E676]">
                  <MapPin className="h-3.5 w-3.5" />
                </div>
                <p className="text-xs font-semibold text-white">
                  {hero.cardBottomRight.title}
                </p>
              </div>

              {/* Handwritten Doodle on right side */}
              <div className="hidden lg:block absolute bottom-1 -right-24 rotate-12 text-[#00E676]/90 font-serif italic text-xs font-bold tracking-wider leading-tight select-none pointer-events-none text-left">
                Better<br />
                Visuals<br />
                Brighter<br />
                Brands ✦
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom Section: Stats & Brand Logos Glass Container ─────── */}
        <div className="mt-14 sm:mt-20 relative">
          <div className="liquid-glass-card rounded-3xl p-6 sm:p-8 border border-emerald-500/30 bg-[#040D09]/85 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
            
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 items-center pb-6 border-b border-emerald-500/20">
              {hero.stats.map((stat, idx) => {
                const StatIcons = [Sparkles, Users, Award, CheckCircle2];
                const IconComponent = StatIcons[idx % StatIcons.length] || Sparkles;
                return (
                  <div key={idx} className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-[#00E676] border border-emerald-400/30">
                        <IconComponent className="h-3.5 w-3.5" />
                      </div>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                        {stat.value}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-slate-300 mt-0.5">
                      {stat.label}
                    </span>
                  </div>
                );
              })}

              {/* Trusted By Tag */}
              <div className="col-span-2 md:col-span-4 lg:col-span-1 flex items-center justify-start lg:justify-end">
                <span className="text-xs font-medium text-slate-300 tracking-wider">
                  Trusted by amazing brands
                </span>
              </div>
            </div>

            {/* Brand Logos Row */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 items-center justify-items-center opacity-90">
              {hero.brands.map((brand, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-center p-2 transition-transform duration-200 hover:scale-105"
                >
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    width={130}
                    height={36}
                    unoptimized
                    className="h-7 sm:h-8 w-auto object-contain filter brightness-110"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Very Bottom of Hero: Scroll Down Indicator & Tagline ─────── */}
        <div className="mt-4 sm:mt-5 flex items-center justify-between relative">
          {/* Left Tagline */}
          <div className="hidden sm:flex flex-col text-[9px] font-extrabold tracking-widest text-[#00E676]/80 uppercase leading-tight select-none">
            <span>CREATE</span>
            <span>VISUALS</span>
            <span>THAT SELL</span>
          </div>

          {/* Centered Scroll Down */}
          <div className="mx-auto flex flex-col items-center gap-1.5 text-slate-400">
            <div className="flex h-7 w-4 items-start justify-center rounded-full border border-emerald-400/40 p-1">
              <span className="h-1.5 w-1 rounded-full bg-[#00E676] animate-bounce" />
            </div>
            <span className="text-[10px] font-semibold tracking-wider text-slate-300 uppercase">
              Scroll Down
            </span>
          </div>

          <div className="hidden sm:block w-16" />
        </div>
      </div>
    </section>
  );
}
