'use client';

import { useEffect } from 'react';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  LIGHTWEIGHT KINETIC TEXT SCROLL (ZERO LAG)
 * ─────────────────────────────────────────────────────────────────────────────
 *  When scrolling, text elements stretch subtly taller vertically
 *  ("halka aktu lomba hobe"), snapping back elastically like rubber
 *  as soon as scrolling settles.
 *  Uses 100% passive requestAnimationFrame — 0 blocking, butter-smooth 120 FPS.
 */
export function KineticTextScroll() {
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;
    let resetTimer: NodeJS.Timeout;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          const delta = Math.abs(currentY - lastScrollY);
          lastScrollY = currentY;

          // Subtle vertical elongation: from 1.00 up to ~1.045 max
          const stretch = Math.min(1 + delta * 0.0006, 1.045);
          document.documentElement.style.setProperty(
            '--text-stretch-y',
            stretch.toFixed(4)
          );

          clearTimeout(resetTimer);
          resetTimer = setTimeout(() => {
            document.documentElement.style.setProperty('--text-stretch-y', '1');
          }, 90);

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(resetTimer);
      document.documentElement.style.removeProperty('--text-stretch-y');
    };
  }, []);

  return null;
}
