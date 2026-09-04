'use client';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  FLOATING LIQUID GLASS HEADER
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  Matches the exact mockup with the glowing emerald swirl mark,
 *  full name "TARIKUZZAMAN SABBIR", central floating liquid glass pill menu,
 *  and "Let's Talk ↗" neon action button.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Menu, X } from 'lucide-react';

import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/work' },
  { label: 'Contact', href: '/contact' },
];

function isActiveRoute(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, close]);

  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 transition-all duration-300", scrolled ? "pt-2" : "pt-3 sm:pt-4")}>
      <div className="shell flex items-center justify-between gap-3">
        {/* ── 1. Logo & Identity ────────────────────────────────────────── */}
        <Link
          href="/"
          className="group flex items-center gap-3 rounded-xl focus:outline-none"
          aria-label="Tarikuzzaman Sabbir — Home"
        >
          {/* Glowing Green Neon Swirl S Icon */}
          <div className="relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-700 shadow-[0_0_24px_rgba(0,245,155,0.45)] transition-transform duration-300 group-hover:scale-105">
            <svg
              className="h-5 w-5 sm:h-6 sm:w-6 text-black"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18M18 6v10M18 6H8" />
            </svg>
          </div>

          <div className="flex flex-col">
            <span className="text-sm sm:text-[15px] font-extrabold tracking-wider text-white uppercase leading-tight">
              TARIKUZZAMAN <span className="text-emerald-400">SABBIR</span>
            </span>
            <span className="text-[9px] sm:text-[10px] font-semibold tracking-widest text-emerald-400/80 uppercase leading-none mt-0.5">
              AI PRODUCT PHOTOGRAPHER & CREATIVE DESIGNER
            </span>
          </div>
        </Link>

        {/* ── 2. Center Floating Liquid Glass Pill Nav ─────────────────── */}
        <nav
          aria-label="Main navigation"
          className="hidden md:flex liquid-glass rounded-full px-2.5 py-1.5 items-center gap-1 border border-emerald-500/25 shadow-[0_8px_30px_rgb(0,0,0,0.6)]"
        >
          {NAV_ITEMS.map((item) => {
            const active = isActiveRoute(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide transition-all duration-200',
                  active
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-[0_0_15px_rgba(0,245,155,0.2)]'
                    : 'text-slate-300 hover:text-white hover:bg-white/5',
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* ── 3. Right CTA & Mobile Toggle ──────────────────────────────── */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/contact"
            className="btn-neon hidden sm:inline-flex items-center gap-1 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black transition-all duration-200"
          >
            Let’s Talk
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>

          {/* Mobile hamburger button */}
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full liquid-glass border border-emerald-500/30 text-white md:hidden"
          >
            {open ? (
              <X className="h-5 w-5 text-emerald-400" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5 text-emerald-400" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile Drawer ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            id="mobile-nav"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="shell mt-2 md:hidden"
          >
            <div className="liquid-glass rounded-2xl border border-emerald-500/30 p-5 shadow-2xl">
              <nav className="flex flex-col space-y-1">
                {NAV_ITEMS.map((item) => {
                  const active = isActiveRoute(pathname, item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={close}
                      className={cn(
                        'flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-colors',
                        active
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'text-slate-300 hover:bg-white/5 hover:text-white',
                      )}
                    >
                      <span>{item.label}</span>
                      {active && (
                        <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#00F59B]" />
                      )}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-4 pt-3 border-t border-emerald-500/20">
                <Link
                  href="/contact"
                  onClick={close}
                  className="btn-neon w-full justify-center text-center rounded-xl py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  Let’s Talk
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
