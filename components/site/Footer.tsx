'use client';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  FOOTER — MATCHING EXACT MOCKUP
 * ─────────────────────────────────────────────────────────────────────────────
 */

import Link from 'next/link';
import { ArrowUp, Facebook, Instagram, Linkedin, Mail, MessageSquare } from 'lucide-react';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-emerald-500/20 bg-[#020906] pt-16 pb-12 overflow-hidden">
      <div className="shell">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-emerald-500/15">
          
          {/* ── Brand Info (Col 1-4) ─────────────────────────────────────── */}
          <div className="lg:col-span-4">
            <Link href="/" className="group flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 shadow-[0_0_20px_rgba(0,245,155,0.4)]">
                <svg
                  className="h-5 w-5 text-black"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.8"
                >
                  <path d="M18 6L6 18M18 6v10M18 6H8" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-extrabold tracking-wider text-white uppercase">
                  TARIKUZZAMAN <span className="text-emerald-400">SABBIR</span>
                </span>
                <span className="text-[9px] font-semibold tracking-widest text-emerald-400/80 uppercase">
                  AI PRODUCT PHOTOGRAPHER & CREATIVE DESIGNER
                </span>
              </div>
            </Link>

            <p className="mt-4 text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Creating high-quality product visuals, creative content and digital experiences for
              modern brands.
            </p>

            {/* Social Icons */}
            <div className="mt-6 flex items-center gap-2.5">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex h-8 w-8 items-center justify-center rounded-full liquid-glass border border-emerald-500/30 text-slate-300 hover:text-emerald-400 hover:border-emerald-400 transition-colors"
              >
                <Facebook className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-8 w-8 items-center justify-center rounded-full liquid-glass border border-emerald-500/30 text-slate-300 hover:text-emerald-400 hover:border-emerald-400 transition-colors"
              >
                <Instagram className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="flex h-8 w-8 items-center justify-center rounded-full liquid-glass border border-emerald-500/30 text-slate-300 hover:text-emerald-400 hover:border-emerald-400 transition-colors"
              >
                <Linkedin className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X Twitter"
                className="flex h-8 w-8 items-center justify-center rounded-full liquid-glass border border-emerald-500/30 text-slate-300 hover:text-emerald-400 hover:border-emerald-400 transition-colors font-bold text-xs"
              >
                𝕏
              </a>
            </div>
          </div>

          {/* ── Quick Links (Col 5-6) ────────────────────────────────────── */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li>
                <Link href="/" className="hover:text-emerald-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-emerald-400 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-emerald-400 transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/work" className="hover:text-emerald-400 transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* ── Services (Col 7-9) ───────────────────────────────────────── */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Services
            </h3>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li>Product Photography</li>
              <li>Model Photography</li>
              <li>UGC & Ads Video</li>
              <li>Poster Design</li>
              <li>Website Design</li>
              <li>Prompt Engineering</li>
            </ul>
          </div>

          {/* ── Contact Details & Doodle (Col 10-12) ─────────────────────── */}
          <div className="lg:col-span-3 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
                Contact
              </h3>
              <ul className="space-y-2.5 text-xs font-medium text-slate-300">
                <li className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-emerald-400" />
                  <a
                    href="mailto:sabbir@webring.co"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    sabbir@webring.co
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Linkedin className="h-3.5 w-3.5 text-emerald-400" />
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    tarikuzzaman-sabbir
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />
                  <span>WhatsApp: +880 17XX-XXXXXX</span>
                </li>
              </ul>
            </div>

            {/* Doodle and Back to Top Button */}
            <div className="mt-6 flex items-end justify-between">
              <div className="rotate-6 text-emerald-400 font-serif italic text-xs font-bold leading-tight select-none pointer-events-none">
                Ideas<br />
                Designs<br />
                Reality
              </div>

              <button
                onClick={scrollToTop}
                aria-label="Back to top"
                className="flex h-10 w-10 items-center justify-center rounded-full liquid-glass border border-emerald-400/40 text-emerald-400 hover:bg-emerald-400 hover:text-black transition-all shadow-[0_0_15px_rgba(0,245,155,0.3)]"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Bottom Copyright Row ──────────────────────────────────────── */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} Tarikuzzaman Sabbir. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-slate-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-400 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
