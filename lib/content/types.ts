/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  CONTENT TYPES — the contract between the content source and the UI
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  Both content sources return these exact shapes:
 *
 *    data/*.ts          → typed local files (default)
 *    sanity/            → Sanity v3 dataset (when env vars are present)
 *
 *  Because the adapter in `lib/content/index.ts` normalises both into these
 *  types, no component ever knows or cares which source is live. Switching to
 *  Sanity is an env-var change, not a refactor.
 */

/* ── Shared primitives ────────────────────────────────────────────────────── */

/**
 * An image reference. `src` is either a path under /public (local mode) or a
 * fully-resolved cdn.sanity.io URL (Sanity mode).
 *
 * `alt` is required — not optional — because an empty alt on a portfolio image
 * is an accessibility failure, and making it required means the type system
 * catches it instead of an audit six months later.
 */
export interface ContentImage {
  src: string;
  alt: string;
  /** Intrinsic pixel width, so next/image can reserve space and avoid CLS. */
  width: number;
  /** Intrinsic pixel height. */
  height: number;
  /** Tiny base64 LQIP shown while the full image decodes. Optional. */
  blurDataURL?: string;
}

/** Category slugs used by the portfolio filter. Kept as a union so a typo
 *  in a data file fails the build rather than silently rendering an empty tab. */
export type ProjectCategory = 'fashion' | 'product' | 'video' | 'web';

/** Human labels for the filter chips, derived from the union above. */
export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  fashion: 'Fashion & Apparel',
  product: 'Product',
  video: 'Ad & Video',
  web: 'Web',
};

/** Display order for the filter bar. */
export const CATEGORY_ORDER: readonly ProjectCategory[] = [
  'fashion',
  'product',
  'video',
  'web',
] as const;

/* ── Projects / case studies ──────────────────────────────────────────────── */

/** A quantified outcome shown as a stat block inside a case study. */
export interface ProjectMetric {
  label: string;
  value: string;
  /** Optional one-line clarification, e.g. how the number was measured. */
  note?: string;
}

/**
 * A before/after pair for the comparison slider.
 *
 * "Before" is typically the client's raw phone photo or flat-lay; "after" is
 * the generated catalog frame. Both must share the same aspect ratio or the
 * slider handle will not line up.
 */
export interface BeforeAfterPair {
  before: ContentImage;
  after: ContentImage;
  caption: string;
}

/** An embedded video. Only these two hosts are allowed by the CSP frame-src. */
export interface ProjectVideo {
  provider: 'youtube' | 'vimeo';
  /** Bare id, not a full URL — the embed URL is constructed server-side. */
  id: string;
  title: string;
  /** Poster frame shown before the iframe is mounted (click-to-load). */
  poster?: ContentImage;
}

export interface Project {
  /** URL-safe unique id. Also the React key and the lightbox deep-link hash. */
  slug: string;
  title: string;
  /** Real client or brand name. */
  client: string;
  category: ProjectCategory;
  /** Short teaser shown on the grid card. Aim for under 120 characters. */
  summary: string;
  /** Year the work shipped, for the card meta line. */
  year: string;
  /** Whether this project gets a larger cell in the masonry grid. */
  featured: boolean;
  /** Primary grid thumbnail. */
  cover: ContentImage;
  /** Extra frames shown in the lightbox gallery. */
  gallery: ContentImage[];
  /** The problem the client arrived with. */
  challenge: string;
  /** What I actually did — tools, pipeline, prompt strategy. */
  approach: string;
  /** What the client got, and what it changed for them. */
  outcome: string;
  /** Hard numbers. Rendered as a small stat row. */
  metrics: ProjectMetric[];
  /** Tools used, rendered as chips. */
  tools: string[];
  /** Optional before/after comparison. */
  comparison?: BeforeAfterPair;
  /** Optional video embed for ad/UGC work. */
  video?: ProjectVideo;
}

/* ── Services ─────────────────────────────────────────────────────────────── */

/** Lucide icon name. Validated against the imported icon map at render time,
 *  with a documented fallback, so a bad name degrades instead of crashing. */
export type IconName =
  | 'camera'
  | 'sparkles'
  | 'film'
  | 'layout'
  | 'wand'
  | 'layers'
  | 'zap'
  | 'shield';

export interface Service {
  slug: string;
  title: string;
  /** One-sentence description of the deliverable. */
  description: string;
  icon: IconName;
  /** Concrete bullet points — what is actually included. */
  includes: string[];
  /** Starting price as a display string, or undefined to show "On request". */
  startingAt?: string;
  /** Typical turnaround, e.g. "48 hours". */
  turnaround: string;
}

/* ── Process ──────────────────────────────────────────────────────────────── */

export interface ProcessStep {
  /** 1-based, used for the numeral in the timeline. */
  order: number;
  title: string;
  description: string;
  /** What the client needs to do or provide at this step, if anything. */
  clientAction?: string;
  /** Rough duration for expectation-setting, e.g. "Same day". */
  duration: string;
}

/* ── Testimonials ─────────────────────────────────────────────────────────── */

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  /** Role plus company, e.g. "Founder, Kain". */
  role: string;
  /** 1–5. Rendered as stars with an accessible text equivalent. */
  rating: 1 | 2 | 3 | 4 | 5;
  /** Optional avatar. Falls back to a monogram when absent. */
  avatar?: ContentImage;
  /** Where the review came from, e.g. "Upwork". */
  source?: string;
}

/* ── Tools & stack ────────────────────────────────────────────────────────── */

export interface Tool {
  name: string;
  /** What I use it for — one short clause. */
  purpose: string;
  /** Grouping for the badge row. */
  group: 'generation' | 'post' | 'build' | 'delivery';
}

/* ── The full payload the pages consume ───────────────────────────────────── */

export interface SiteContent {
  projects: Project[];
  services: Service[];
  process: ProcessStep[];
  testimonials: Testimonial[];
  tools: Tool[];
}
