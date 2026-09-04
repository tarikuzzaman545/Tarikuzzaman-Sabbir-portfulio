'use client';

/**
 * Theme provider.
 *
 * `attribute="class"` matches `darkMode: 'class'` in tailwind.config.ts, so the
 * token swap in globals.css is driven by a single class on <html>.
 *
 * `enableSystem` gives the automatic half of the brief — the site follows the OS
 * on first visit — while the toggle in the header writes an explicit choice to
 * localStorage that then wins. That is the behaviour people expect: the system
 * decides until you say otherwise.
 *
 * `disableTransitionOnChange` matters more than it sounds. Without it, every
 * element carrying a colour transition animates independently during the swap,
 * which reads as a smear rather than a switch. next-themes injects a
 * one-frame `* { transition: none }` to make the change instant.
 */

import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="sabbir-portfolio-theme"
    >
      {children}
    </NextThemesProvider>
  );
}
