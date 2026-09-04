'use client';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  FLOATING LIQUID GLASS HEADER
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  - Only "TARIKUZZAMAN SABBIR" (no subtitle)
 *  - On scroll: brand text slightly enlarges, header gets solid frosted backdrop-blur
 *  - Nav items (Home, About, Services, Portfolio, Contact) enclosed in liquid glass capsule
 *  - "Let's Talk ↗" neon action button
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
    <header className="fixed inset-x-0 top-0 z-50 flex flex-col items-center pointer-events-none pt-3 sm:pt-5 px-3 sm:px-6">
      <div
        className={cn(
          'pointer-events-auto flex items-center justify-between gap-3 sm:gap-6 w-full transition-all duration-500 ease-out',
          scrolled
            ? 'max-w-4xl py-2 px-3.5 sm:px-5 rounded-full liquid-glass-floating-pill shadow-[0_24px_50px_rgba(0,0,0,0.95),0_0_35px_rgba(0,245,155,0.3)]'
            : 'max-w-7xl py-1.5 px-2 sm:px-4 bg-transparent border-transparent shadow-none',
        )}
      >
        {/* ── 1. Logo & Identity (At top: stands alone on left; On scroll: merges into the left of the round capsule) ── */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 sm:gap-3 rounded-full focus:outline-none shrink-0"
          aria-label="Tarikuzzaman Sabbir — Home"
        >
          {/* Official 3D Emerald S Ribbon Logo */}
          <div
            className={cn(
              'relative flex items-center justify-center shrink-0 transition-all duration-300',
              scrolled ? 'h-9 w-9 sm:h-9.5 sm:w-9.5' : 'h-10 w-10 sm:h-11 sm:w-11',
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

          <div className="flex flex-col justify-center">
            <span
              className={cn(
                'font-extrabold uppercase leading-tight font-sans transition-all duration-300 text-white',
                scrolled
                  ? 'text-sm sm:text-base tracking-wide'
                  : 'text-xs sm:text-sm md:text-base tracking-wider',
              )}
            >
              TARIKUZZAMAN <span className="text-[#00E676]">SABBIR</span>
            </span>

            {/* Tagline that collapses/slides left into logo on scroll */}
            <div
              className={cn(
                'overflow-hidden transition-all duration-500 ease-in-out',
                scrolled
                  ? 'max-h-0 max-w-0 opacity-0 -translate-x-6 pointer-events-none mt-0'
                  : 'max-h-6 max-w-[320px] opacity-100 translate-x-0 mt-0.5',
              )}
            >
              <span className="text-[8px] sm:text-[9px] font-bold tracking-[0.14em] uppercase text-emerald-400/90 whitespace-nowrap block">
                AI PRODUCT PHOTOGRAPHER & CREATIVE DESIGNER
              </span>
            </div>
          </div>
        </Link>

        {/* ── 2. Center Nav: At top, THIS IS THE EXCLUSIVE ROUND CAPSULE with Home/About/Services/Portfolio/Contact ── */}
        <nav
          aria-label="Main navigation"
          className={cn(
            'hidden md:flex items-center gap-1 sm:gap-1.5 transition-all duration-500',
            scrolled
              ? 'bg-transparent border-transparent shadow-none px-0 py-0'
              : 'liquid-glass-floating-pill rounded-full px-3.5 sm:px-4 py-1.5 shadow-[0_12px_30px_rgba(0,0,0,0.6)]',
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
                  'relative rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-all duration-300',
                  active
                    ? 'bg-[#00E676] text-black font-bold shadow-[0_0_16px_rgba(0,230,118,0.5),inset_0_1px_1px_rgba(255,255,255,0.6)]'
                    : 'text-slate-300 hover:text-white hover:bg-white/10',
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* ── 3. Right CTA (At top: stands alone on right; On scroll: merges into the right of the round capsule) ── */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            href="/contact"
            className="btn-neon hidden sm:inline-flex items-center gap-1.5 rounded-full px-4.5 py-2 text-xs font-bold uppercase tracking-wider text-black transition-all duration-300 shadow-[0_0_20px_rgba(0,245,155,0.4)] hover:scale-105"
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
            className="inline-flex h-8.5 w-8.5 sm:h-9.5 sm:w-9.5 items-center justify-center rounded-full border border-emerald-500/30 text-white md:hidden hover:bg-white/10 transition-colors"
          >
            {open ? (
              <X className="h-5 w-5 text-emerald-400" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5 text-emerald-400" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile Drawer: Floating glass card ─────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            id="mobile-nav"
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            className="pointer-events-auto mt-2 w-full max-w-sm md:hidden"
          >
            <div className="liquid-glass-floating-pill rounded-3xl p-5 shadow-2xl">
              <nav className="flex flex-col space-y-1">
                {NAV_ITEMS.map((item) => {
                  const active = isActiveRoute(pathname, item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={close}
                      className={cn(
                        'flex items-center justify-between rounded-full px-4 py-2.5 text-sm font-semibold transition-colors',
                        active
                          ? 'bg-[#00E676] text-black font-bold shadow-[0_0_15px_rgba(0,230,118,0.5)]'
                          : 'text-slate-300 hover:bg-white/10 hover:text-white',
                      )}
                    >
                      <span>{item.label}</span>
                      {active && (
                        <span className="h-2 w-2 rounded-full bg-black" />
                      )}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-4 pt-3 border-t border-emerald-500/20">
                <Link
                  href="/contact"
                  onClick={close}
                  className="btn-neon w-full justify-center text-center rounded-full py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
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
