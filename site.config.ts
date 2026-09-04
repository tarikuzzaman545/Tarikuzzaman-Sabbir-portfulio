/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  SINGLE SOURCE OF TRUTH FOR EVERY LINK, HANDLE AND CONTACT DETAIL
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  Anything marked FILL_ME is a real-world value I could not invent for you.
 *  Search this file for "FILL_ME" and replace all of them before you deploy.
 *
 *  Nothing else in the codebase hardcodes a URL or an email address, so this
 *  is the only file you need to touch for contact details.
 */

export const FILL_ME = 'FILL_ME' as const;

/** True when a value still needs replacing — used to hide broken links. */
export function isPlaceholder(value: string): boolean {
  return value === FILL_ME || value.trim() === '' || value.includes('FILL_ME');
}

export const siteConfig = {
  /* ── Identity ───────────────────────────────────────────────────────────── */
  name: 'MD Tarikuzzaman Sabbir',
  shortName: 'Sabbir',
  initials: 'TS',
  role: 'AI Product Photographer & Prompt Engineer',
  tagline: 'Catalog-ready product imagery, generated at scale.',

  /**
   * One-line value proposition used in the hero and as the meta description
   * seed. Kept under ~155 characters so search results do not truncate it.
   */
  valueProp:
    'I turn a product link into a full set of catalog-ready images — no studio, no shipping samples, no reshoots.',

  location: 'Khulna, Bangladesh',
  timezone: 'Asia/Dhaka',
  availability: 'Available for new projects',

  /* ── Deployment ─────────────────────────────────────────────────────────── */
  /**
   * Canonical production URL, no trailing slash. Vercel sets VERCEL_URL
   * automatically on preview deploys, so this only needs to be your final
   * custom domain. Used for canonical tags, OG images, and sitemap.xml.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://sabbir.studio', // FILL_ME — your real domain

  /* ── Contact ────────────────────────────────────────────────────────────── */
  contact: {
    /** Where the contact form delivers, and the mailto: link target. */
    email: FILL_ME, // FILL_ME — e.g. 'hello@yourdomain.com'
    /** Optional. Shown next to the email if present. Include country code. */
    phone: '', // optional, e.g. '+880 1XXX-XXXXXX'
    /** Optional WhatsApp number, digits only, no + or spaces. */
    whatsapp: '', // optional, e.g. '8801XXXXXXXXX'
  },

  /* ── Social / profiles ──────────────────────────────────────────────────── */
  socials: {
    upwork: FILL_ME, // FILL_ME — e.g. 'https://www.upwork.com/freelancers/~01xxxxxxxx'
    linkedin: FILL_ME, // FILL_ME — e.g. 'https://www.linkedin.com/in/yourhandle'
    github: '', // optional
    instagram: '', // optional
    behance: '', // optional
    x: '', // optional
  },

  /* ── Agency ─────────────────────────────────────────────────────────────── */
  agency: {
    name: 'WEBRING',
    role: 'Co-founder',
    description: 'AI-powered e-commerce product photography and branding agency.',
    url: '', // optional — WEBRING site if/when it is live
  },

  /* ── Education ──────────────────────────────────────────────────────────── */
  education: {
    degree: 'BSc in Computer Science & Engineering',
    institution: 'NUBTK',
    institutionFull: 'Northern University of Business & Technology, Khulna',
    location: 'Khulna, Bangladesh',
    status: 'In progress',
  },

  /* ── Headline stats (hero + about) ──────────────────────────────────────── */
  /**
   * Keep these honest — they are the first thing a client reads. Update the
   * numbers as the work grows.
   */
  stats: [
    { value: '15+', label: 'Brands served' },
    { value: '5,000+', label: 'Images delivered' },
    { value: '6', label: 'Angles per product' },
    { value: '48h', label: 'Typical turnaround' },
  ],

  /* ── SEO defaults ───────────────────────────────────────────────────────── */
  seo: {
    titleTemplate: '%s · MD Tarikuzzaman Sabbir',
    defaultTitle: 'MD Tarikuzzaman Sabbir — AI Product Photographer & Prompt Engineer',
    keywords: [
      'AI product photography',
      'prompt engineering',
      'e-commerce product images',
      'AI fashion photography',
      'catalog photography',
      'Higgsfield',
      'product visualization',
      'AI ad video',
      'Bangladesh',
      'Khulna',
      'WEBRING',
    ],
    /** Twitter/X handle for the card attribution. Leave blank to omit. */
    twitterHandle: '',
    locale: 'en_US',
  },

  /* ── Navigation ───────────────────────────────────────────────────────────
   * Real routes, not in-page anchors. Each is a dedicated App Router page under
   * app/, so the Header can use next/link with a pathname-based active state. */
  nav: [
    { label: 'Work', href: '/work' },
    { label: 'Services', href: '/services' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],

  /* ── Contact form options ───────────────────────────────────────────────── */
  form: {
    projectTypes: [
      'Product photography (catalog)',
      'Fashion / apparel on model',
      'Prompt engineering / pipeline setup',
      'Ad or UGC video',
      'AI-assisted website build',
      'Something else',
    ],
    budgetRanges: [
      'Under $250',
      '$250 – $500',
      '$500 – $1,000',
      '$1,000 – $2,500',
      '$2,500+',
      'Not sure yet',
    ],
  },
} as const;

export type SiteConfig = typeof siteConfig;

/** Absolute URL builder for canonical tags, OG images, and the sitemap. */
export function absoluteUrl(path = ''): string {
  const base = siteConfig.url.replace(/\/$/, '');
  if (!path) return base;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Social links that have actually been filled in, ready to render. */
export function activeSocials() {
  return Object.entries(siteConfig.socials)
    .filter(([, url]) => !isPlaceholder(url))
    .map(([key, url]) => ({ key, url }));
}
