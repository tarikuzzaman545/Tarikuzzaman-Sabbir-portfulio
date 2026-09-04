'use client';

/**
 * Light / dark toggle.
 *
 * THE MOUNTED GUARD IS NOT OPTIONAL
 * ─────────────────────────────────
 * On the server there is no way to know the user's theme, so `resolvedTheme` is
 * undefined during SSR and the first render. Rendering the real icon then would
 * produce a hydration mismatch on every visit whose stored theme differs from
 * the default. So the first paint is a correctly-sized, aria-hidden placeholder
 * and the button becomes live after mount. The placeholder reserves the exact
 * same box, so nothing shifts.
 *
 * The cycle is two-state (light ⇄ dark) rather than three-state
 * (light → dark → system). A three-way toggle needs a label to be
 * comprehensible, and an icon-only control that silently lands on "system"
 * leaves people unsure what they just did. System remains the default until
 * touched; the toggle then expresses an explicit preference.
 */

import { motion, useReducedMotion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === 'dark';

  const shell = cn(
    'relative inline-flex h-10 w-10 items-center justify-center rounded-pill',
    'border border-line text-ink-soft transition-colors',
    'hover:border-gold/50 hover:text-ink',
    className,
  );

  if (!mounted) {
    // Same dimensions as the live button, so mounting causes no layout shift.
    return <div className={shell} aria-hidden="true" />;
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={shell}
      // The label states the ACTION, not the current state. "Dark mode" on a
      // toggle is ambiguous; "Switch to light theme" never is.
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      <motion.span
        key={isDark ? 'moon' : 'sun'}
        initial={reduceMotion ? false : { rotate: -75, opacity: 0, scale: 0.7 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.28, ease: [0.34, 1.4, 0.64, 1] }}
        className="flex"
      >
        {isDark ? (
          <Moon className="h-[1.05rem] w-[1.05rem]" aria-hidden="true" />
        ) : (
          <Sun className="h-[1.05rem] w-[1.05rem]" aria-hidden="true" />
        )}
      </motion.span>
    </button>
  );
}
