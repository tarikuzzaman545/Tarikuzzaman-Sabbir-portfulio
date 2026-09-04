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
import Image from 'next/image';
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
    const onScroll = () => setScrolled(window.scrollY > 30);
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
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300 pointer-events-none',
        scrolled ? 'pt-3' : 'pt-4 sm:pt-5',
      )}
    >
      <div className="shell flex justify-center">
        {/* Unified Capsule on Scroll / Full Width on Top */}
        <div
          className={cn(
            'pointer-events-auto w-full transition-all duration-300 flex items-center justify-between gap-3',
            scrolled
              ? 'max-w-5xl rounded-full border border-emerald-500/35 bg-[#040D09]/92 backdrop-blur-2xl px-4 sm:px-6 py-2 shadow-[0_12px_40px_rgba(0,0,0,0.85)]'
              : 'max-w-7xl',
          )}
        >
          {/* ── 1. Logo & Identity ────────────────────────────────────────── */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 sm:gap-3 rounded-xl focus:outline-none shrink-0"
            aria-label="Tarikuzzaman Sabbir — Home"
          >
            {/* Official 3D Emerald S Ribbon Logo */}
            <div
              className={cn(
                'relative flex items-center justify-center shrink-0 transition-all duration-300',
                scrolled ? 'h-9 w-9 sm:h-10 sm:w-10' : 'h-10 w-10 sm:h-11 sm:w-11',
              )}
            >
              <div className="absolute inset-0 rounded-full bg-emerald-500/25 blur-md -z-10 group-hover:bg-emerald-400/40 transition-colors" />
              <Image
                src="/img/brand/logo.png"
                alt="Tarikuzzaman Sabbir Logo"
                width={48}
                height={48}
                priority
                unoptimized
                className="h-full w-full object-contain drop-shadow-[0_0_12px_rgba(0,230,118,0.5)] transition-transform duration-300 group-hover:scale-110"
              />
            </div>

            <div className="flex flex-col justify-center overflow-hidden">
              <span
                className={cn(
                  'font-extrabold uppercase leading-tight font-sans transition-all duration-300',
                  scrolled
                    ? 'text-[15px] sm:text-[17px] tracking-wide text-white'
                    : 'text-sm sm:text-[15px] tracking-wider text-white',
                )}
              >
                TARIKUZZAMAN <span className="text-[#00E676]">SABBIR</span>
              </span>

              {/* Subtitle: slides left into logo & collapses on scroll */}
              <div
                className={cn(
                  'transition-all duration-300 overflow-hidden',
                  scrolled
                    ? 'opacity-0 -translate-x-6 max-h-0 pointer-events-none'
                    : 'opacity-100 translate-x-0 max-h-5 mt-0.5',
                )}
              >
                <span className="text-[9px] sm:text-[10px] font-medium tracking-widest text-[#00E676]/90 uppercase leading-none block whitespace-nowrap">
                  AI PRODUCT PHOTOGRAPHER &amp; CREATIVE DESIGNER
                </span>
              </div>
            </div>
          </Link>

          {/* ── 2. Center Liquid Glass Nav ───────────────────────────────── */}
          <nav
            aria-label="Main navigation"
            className={cn(
              'hidden md:flex items-center gap-1 transition-all duration-300',
              scrolled
                ? 'px-1 py-0'
                : 'liquid-glass rounded-full px-2.5 py-1.5 border border-emerald-500/25 shadow-[0_8px_30px_rgb(0,0,0,0.6)]',
            )}
          >
            {NAV_ITEMS.map((item) => {
              const active = isActiveRoute(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'relative rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-all duration-200',
                    active
                      ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/40 shadow-[0_0_15px_rgba(0,245,155,0.25)]'
                      : 'text-slate-300 hover:text-white hover:bg-white/5',
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* ── 3. Right CTA & Mobile Toggle ──────────────────────────────── */}
          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href="/contact"
              className={cn(
                'btn-neon hidden sm:inline-flex items-center gap-1 rounded-full font-bold uppercase tracking-wider text-black transition-all duration-200',
                scrolled ? 'px-4 py-2 text-[11px]' : 'px-5 py-2.5 text-xs',
              )}
            >
              Let’s Talk
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>

            {/* Mobile hamburger button */}
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full liquid-glass border border-emerald-500/30 text-white md:hidden"
            >
              {open ? (
                <X className="h-5 w-5 text-emerald-400" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5 text-emerald-400" aria-hidden="true" />
              )}
            </button>
          </div>
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
            className="shell mt-2 md:hidden pointer-events-auto"
          >
            <div className="liquid-glass rounded-2xl border border-emerald-500/35 bg-[#040D09]/95 backdrop-blur-2xl p-5 shadow-2xl">
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
