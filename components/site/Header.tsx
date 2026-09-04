'use client';

/**
 * Sticky header with in-page navigation.
 *
 * SCROLL-SPY WITHOUT A SCROLL LISTENER
 * ────────────────────────────────────
 * The active nav item is tracked with a single IntersectionObserver over the
 * section elements rather than a scroll handler doing getBoundingClientRect on
 * every frame. The observer fires only at threshold crossings, off the main
 * scroll path, which is the difference between a smooth 60fps scroll and a
 * janky one on a mid-range phone.
 *
 * `rootMargin` shifts the detection band to the upper third of the viewport, so
 * a section becomes "active" when its heading area is where the eye is, not when
 * its last pixel scrolls past the bottom.
 *
 * MOBILE MENU FOCUS BEHAVIOUR
 * ───────────────────────────
 * The panel is a real modal: it traps Tab, closes on Escape, locks body scroll,
 * and returns focus to the trigger on close. A menu that lets you Tab into the
 * page behind it while it is covering that page is a keyboard trap in reverse.
 */

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';
import { siteConfig } from '@/site.config';

import { ThemeToggle } from './ThemeToggle';

/** Section ids observed for the active-link highlight, derived from the nav. */
const SECTION_IDS = siteConfig.nav
  .map((item) => item.href)
  .filter((href) => href.startsWith('#'))
  .map((href) => href.slice(1));

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>('');
  const reduceMotion = useReducedMotion();

  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  /* ── Condense the bar once the hero is behind it ────────────────────────── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    // `passive` tells the browser this handler never calls preventDefault, so it
    // does not have to wait for it before scrolling.
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Scroll-spy ─────────────────────────────────────────────────────────── */
  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // More than one section can be intersecting at once, so pick the one
        // highest in the viewport rather than whichever entry arrived last.
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const first = visible[0];
        if (first) setActive(first.target.id);
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  /* ── Modal behaviour for the mobile panel ───────────────────────────────── */
  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!focusables || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;

      // Wrap the tab order at both ends so focus cannot escape the panel.
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    // Lock scroll. Padding compensates for the removed scrollbar so the layout
    // does not jump sideways as the menu opens.
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    document.body.style.overflow = 'hidden';
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

    // Move focus into the panel on open.
    panelRef.current?.querySelector<HTMLElement>('a[href]')?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
    };
  }, [open, close]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled ? 'glass border-b border-line shadow-soft' : 'border-b border-transparent',
      )}
    >
      <div className="shell flex h-[4.5rem] items-center justify-between gap-4">
        {/* ── Wordmark ─────────────────────────────────────────────────────── */}
        <Link
          href="/"
          className="group flex items-baseline gap-2 rounded-lg"
          aria-label={`${siteConfig.name} — home`}
        >
          <span className="font-display text-lg font-semibold tracking-tight text-ink">
            {siteConfig.shortName}
          </span>
          <span
            className="h-1.5 w-1.5 rounded-full bg-gold transition-transform duration-300 group-hover:scale-150"
            aria-hidden="true"
          />
          <span className="hidden text-xs font-medium uppercase tracking-[0.16em] text-ink-muted sm:inline">
            {siteConfig.agency.name}
          </span>
        </Link>

        {/* ── Desktop nav ──────────────────────────────────────────────────── */}
        <nav aria-label="Main navigation" className="hidden items-center gap-1 md:flex">
          {siteConfig.nav.map((item) => {
            const id = item.href.replace('#', '');
            const isActive = active === id;
            return (
              <a
                key={item.href}
                href={item.href}
                // aria-current is the accessible half of the visual highlight.
                aria-current={isActive ? 'true' : undefined}
                className={cn(
                  'relative rounded-pill px-3.5 py-2 text-sm font-medium transition-colors',
                  isActive ? 'text-ink' : 'text-ink-soft hover:text-ink',
                )}
              >
                {item.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-x-2.5 -bottom-0.5 h-px bg-gold"
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { type: 'spring', stiffness: 380, damping: 32 }
                    }
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* ── Actions ──────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          <a href="#contact" className="btn-gold hidden !px-5 !py-2.5 text-sm sm:inline-flex">
            Hire me
          </a>

          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-pill border border-line text-ink md:hidden"
          >
            {open ? (
              <X className="h-[1.05rem] w-[1.05rem]" aria-hidden="true" />
            ) : (
              <Menu className="h-[1.05rem] w-[1.05rem]" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile panel ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
              onClick={close}
              className="fixed inset-0 top-[4.5rem] z-40 bg-ink/25 md:hidden"
              aria-hidden="true"
            />
            <motion.div
              ref={panelRef}
              id="mobile-nav"
              // role="dialog" + aria-modal tells a screen reader the rest of the
              // page is inert, matching the actual focus trap.
              role="dialog"
              aria-modal="true"
              aria-label="Main navigation"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
              transition={{ duration: reduceMotion ? 0 : 0.24, ease: [0.4, 0, 0.2, 1] }}
              className="glass absolute inset-x-0 top-[4.5rem] z-50 border-b border-line px-gutter pb-6 pt-2 shadow-lift md:hidden"
            >
              <nav className="flex flex-col">
                {siteConfig.nav.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={close}
                    className="border-b border-line/70 py-3.5 text-base font-medium text-ink last:border-0"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              <a href="#contact" onClick={close} className="btn-gold mt-4 w-full">
                Hire me
              </a>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
