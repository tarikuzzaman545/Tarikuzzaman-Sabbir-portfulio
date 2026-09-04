/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  ROOT LAYOUT
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  FONTS ARE SELF-HOSTED, NOT LOADED FROM GOOGLE
 *  ─────────────────────────────────────────────
 *  `next/font/local` reads the subset .woff files in public/fonts at build time
 *  and emits them as immutable hashed assets. Three reasons this beats
 *  next/font/google here:
 *
 *    1. CSP stays strict. `font-src 'self' data:` needs no fonts.gstatic.com
 *       allowance, and `style-src` needs no external stylesheet.
 *    2. No third-party connection on first paint, which is the single largest
 *       LCP win available on a page this light.
 *    3. `display: 'swap'` plus a declared `adjustFontFallback` means the
 *       fallback metrics are overridden to match, so there is no layout shift
 *       when the webfont lands. That protects the CLS half of the 90+ target.
 *
 *  One typeface, not two. Poppins — a clean geometric sans — is used for both
 *  headings and body; hierarchy comes from size and weight (300/400/500/700),
 *  which reads as more modern than the old serif/sans pairing. Every extra
 *  weight is another 10–25KB for a difference nobody notices.
 *
 *  THEME FLASH
 *  ───────────
 *  `next-themes` needs `suppressHydrationWarning` on <html> because it writes
 *  the `class` and `style` attributes before React hydrates. That is not a bug
 *  being papered over: it is the only way to avoid a flash of the wrong theme,
 *  and the warning would otherwise fire on an attribute React does not own.
 */

import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';

import { JsonLd } from '@/components/seo/JsonLd';
import { Footer } from '@/components/site/Footer';
import { Header } from '@/components/site/Header';
import { ThemeProvider } from '@/components/site/ThemeProvider';
import { siteConfig } from '@/site.config';

import './globals.css';

/* ── Fonts ────────────────────────────────────────────────────────────────── */

const poppins = localFont({
  src: [
    { path: '../public/fonts/poppins-300.woff', weight: '300', style: 'normal' },
    { path: '../public/fonts/poppins-400.woff', weight: '400', style: 'normal' },
    { path: '../public/fonts/poppins-500.woff', weight: '500', style: 'normal' },
    { path: '../public/fonts/poppins-700.woff', weight: '700', style: 'normal' },
  ],
  variable: '--font-poppins',
  display: 'swap',
  fallback: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
  // Overrides the fallback's metrics so the swap does not move any text.
  adjustFontFallback: 'Arial',
  preload: true,
});

/* ── Metadata ─────────────────────────────────────────────────────────────── */

/**
 * `metadataBase` is what lets every relative OG/Twitter image resolve to an
 * absolute URL. Without it Next.js warns and social scrapers get a relative
 * path they cannot fetch.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.seo.defaultTitle,
    template: siteConfig.seo.titleTemplate,
  },
  description: siteConfig.valueProp,
  keywords: [...siteConfig.seo.keywords],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  applicationName: `${siteConfig.shortName} — Portfolio`,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: siteConfig.seo.locale,
    url: siteConfig.url,
    siteName: siteConfig.seo.defaultTitle,
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.valueProp,
    images: [
      {
        url: '/og.jpg',
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — ${siteConfig.role}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.valueProp,
    images: ['/og.jpg'],
    ...(siteConfig.seo.twitterHandle ? { creator: siteConfig.seo.twitterHandle } : {}),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: [
      { url: '/img/brand/logo.png', sizes: 'any', type: 'image/png' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/manifest.webmanifest',
  category: 'technology',
  formatDetection: {
    // Stops iOS Safari turning numbers in the case-study metrics into phone
    // links, which it does aggressively and ugly.
    telephone: false,
  },
};

/**
 * `themeColor` is split by colour scheme so the mobile browser chrome matches
 * the active theme instead of always showing the light cream.
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Not locked to 1 — pinch-zoom must stay available. Capping at 5 is the
  // accessibility floor, and `user-scalable` is left alone entirely.
  maximumScale: 5,
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAFAF8' },
    { media: '(prefers-color-scheme: dark)', color: '#141412' },
  ],
};

/* ── Layout ───────────────────────────────────────────────────────────────── */

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={poppins.variable}>
      <head>
        {/* Structured data lives in <head> as a plain script tag with a nonce-free
            application/ld+json type, which CSP permits without unsafe-inline
            because it is not executable script. */}
        <JsonLd />
      </head>
      <body className="font-sans relative bg-[#020805] text-ink min-h-screen">
        {/* Fullscreen Master 3D Emerald Wave Wallpaper */}
        <div
          className="fixed inset-0 pointer-events-none -z-30 bg-cover bg-center bg-no-repeat opacity-90"
          style={{
            backgroundImage: "url('/img/bg/site-bg.png')",
            backgroundPosition: "center top",
            backgroundSize: "cover",
            backgroundAttachment: "fixed",
          }}
          aria-hidden="true"
        />

        {/* Background Film Grain and Ambient Emerald Glow */}
        <div className="film-grain" aria-hidden="true" />
        <div className="grain-ambient fixed inset-0 pointer-events-none -z-20 opacity-50" aria-hidden="true" />

        <ThemeProvider>
          {/* First focusable element on the page, per WCAG 2.4.1. */}
          <a href="#main" className="skip-link">
            Skip to main content
          </a>

          <Header />

          {/* tabIndex={-1} makes the skip-link target programmatically
              focusable without adding it to the tab order. */}
          <main id="main" tabIndex={-1} className="relative z-10">
            {children}
          </main>

          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
