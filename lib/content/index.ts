/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  CONTENT ADAPTER
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  One job: return the types in `./types` regardless of where the data lives.
 *
 *      NEXT_PUBLIC_SANITY_PROJECT_ID set   → fetch from Sanity
 *      not set                            → read the typed files in `data/`
 *
 *  Two design decisions worth knowing about:
 *
 *  1. FAILURE FALLS BACK, IT DOES NOT THROW.
 *     If Sanity is configured but unreachable — network blip, expired token,
 *     dataset renamed — every getter returns the local data instead of a 500.
 *     A portfolio site that shows slightly stale work beats one that shows an
 *     error page, and the failure is logged so it is not silent.
 *
 *  2. EVERY SANITY DOCUMENT IS VALIDATED BEFORE IT IS TRUSTED.
 *     CMS data is external input. A published document missing a required
 *     field, or carrying a category string that is not in the union, gets
 *     dropped with a warning rather than rendering `undefined` into the DOM.
 *
 *  These are async so the Sanity path is real. In local mode they resolve
 *  immediately — no artificial delay.
 */

import { processStep as _processStepSchemaUnused } from '@/sanity/schemas';

import { process as localProcess } from '@/data/process';
import { projects as localProjects } from '@/data/projects';
import { services as localServices } from '@/data/services';
import { testimonials as localTestimonials } from '@/data/testimonials';
import { tools as localTools } from '@/data/tools';

import { sanityClient, sanityImageDimensions, sanityImageUrl, type SanityImageSource } from '@/sanity/client';
import {
  PROCESS_QUERY,
  PROJECTS_QUERY,
  SERVICES_QUERY,
  TESTIMONIALS_QUERY,
  TOOLS_QUERY,
} from '@/sanity/queries';

import type {
  ContentImage,
  IconName,
  ProcessStep,
  Project,
  ProjectCategory,
  ProjectMetric,
  Service,
  SiteContent,
  Testimonial,
  Tool,
} from './types';

/* Referenced so the schema registry is type-checked by the build even though
 * the website itself never renders a Studio. Removing this would let a broken
 * schema file ship unnoticed. */
void _processStepSchemaUnused;

/** Which source is live. Exposed for the README/debug panel, not for branching
 *  inside components — components must not care. */
export const contentSource: 'sanity' | 'local' = sanityClient ? 'sanity' : 'local';

/* ── Small guards ─────────────────────────────────────────────────────────── */

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter(isNonEmptyString).map((s) => s.trim());
}

const VALID_CATEGORIES: ReadonlySet<string> = new Set<ProjectCategory>([
  'fashion',
  'product',
  'video',
  'web',
]);

const VALID_ICONS: ReadonlySet<string> = new Set<IconName>([
  'camera',
  'sparkles',
  'film',
  'layout',
  'wand',
  'layers',
  'zap',
  'shield',
]);

const VALID_TOOL_GROUPS: ReadonlySet<string> = new Set<Tool['group']>([
  'generation',
  'post',
  'build',
  'delivery',
]);

/**
 * Log a dropped document once, with enough context to find it in the Studio.
 * Uses console.warn deliberately — this is an operator-facing signal, and
 * silently discarding published content is the failure mode to avoid.
 */
function warnDropped(kind: string, reason: string, identifier: unknown): void {
  // eslint-disable-next-line no-console
  console.warn(
    `[content] Dropped ${kind} from Sanity — ${reason}. Identifier: ${String(identifier ?? 'unknown')}`,
  );
}

/* ── Image normalisation ──────────────────────────────────────────────────── */

/** Width requested from the Sanity CDN. Generous, because next/image will
 *  resize down to the actual breakpoints from here. */
const SANITY_IMAGE_WIDTH = 1600;

/**
 * Turn a Sanity image field into a `ContentImage`, or null if it cannot be
 * resolved. Dimensions come from the asset `_ref`, so there is no extra fetch.
 */
function normaliseImage(raw: unknown, fallbackAlt: string): ContentImage | null {
  if (!raw || typeof raw !== 'object') return null;
  const source = raw as SanityImageSource;

  const src = sanityImageUrl(source, SANITY_IMAGE_WIDTH);
  if (!src) return null;

  const dims = sanityImageDimensions(source);
  const alt = isNonEmptyString(source.alt) ? source.alt.trim() : fallbackAlt;

  return {
    src,
    alt,
    // Fall back to a 4:5 portrait frame — the ratio the rest of the gallery
    // uses — so a ref we cannot parse still reserves sensible layout space.
    width: dims?.width ?? 1200,
    height: dims?.height ?? 1500,
  };
}

function normaliseImageArray(raw: unknown, fallbackAlt: string): ContentImage[] {
  if (!Array.isArray(raw)) return [];
  const out: ContentImage[] = [];
  for (const entry of raw) {
    const image = normaliseImage(entry, fallbackAlt);
    if (image) out.push(image);
  }
  return out;
}

/* ── Document normalisers ─────────────────────────────────────────────────── */

function normaliseMetrics(raw: unknown): ProjectMetric[] {
  if (!Array.isArray(raw)) return [];
  const out: ProjectMetric[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== 'object') continue;
    const { label, value, note } = entry as Record<string, unknown>;
    if (!isNonEmptyString(label) || !isNonEmptyString(value)) continue;
    out.push({
      label: label.trim(),
      value: value.trim(),
      ...(isNonEmptyString(note) ? { note: note.trim() } : {}),
    });
  }
  return out;
}

function normaliseProject(raw: unknown): Project | null {
  if (!raw || typeof raw !== 'object') return null;
  const d = raw as Record<string, unknown>;

  const slug = d.slug;
  if (!isNonEmptyString(slug)) {
    warnDropped('project', 'missing slug', d.title);
    return null;
  }

  const required = ['title', 'client', 'summary', 'year', 'challenge', 'approach', 'outcome'] as const;
  for (const key of required) {
    if (!isNonEmptyString(d[key])) {
      warnDropped('project', `missing required field "${key}"`, slug);
      return null;
    }
  }

  if (!isNonEmptyString(d.category) || !VALID_CATEGORIES.has(d.category)) {
    warnDropped('project', `category "${String(d.category)}" is not a known category`, slug);
    return null;
  }

  const title = (d.title as string).trim();
  const cover = normaliseImage(d.cover, `Cover image for the ${title} case study`);
  if (!cover) {
    warnDropped('project', 'cover image is missing or unresolvable', slug);
    return null;
  }

  /* Comparison slider — only included when BOTH frames resolve, because a
   * one-sided comparison renders as a broken control rather than a degraded one. */
  let comparison: Project['comparison'];
  const rawComparison = d.comparison;
  if (rawComparison && typeof rawComparison === 'object') {
    const c = rawComparison as Record<string, unknown>;
    const before = normaliseImage(c.before, `Before: ${title}`);
    const after = normaliseImage(c.after, `After: ${title}`);
    if (before && after) {
      comparison = {
        before,
        after,
        caption: isNonEmptyString(c.caption) ? c.caption.trim() : 'Before and after.',
      };
    }
  }

  /* Video — needs a real provider and a real id. `FILL_ME` is treated as absent
   * so the placeholder in the local data never embeds a wrong video. */
  let video: Project['video'];
  const rawVideo = d.video;
  if (rawVideo && typeof rawVideo === 'object') {
    const v = rawVideo as Record<string, unknown>;
    const provider = v.provider === 'vimeo' ? 'vimeo' : v.provider === 'youtube' ? 'youtube' : null;
    const id = isNonEmptyString(v.id) ? v.id.trim() : '';
    if (provider && id && id !== 'FILL_ME') {
      const poster = normaliseImage(v.poster, `Video poster frame for ${title}`);
      video = {
        provider,
        id,
        title: isNonEmptyString(v.title) ? v.title.trim() : `${title} — video`,
        ...(poster ? { poster } : {}),
      };
    }
  }

  return {
    slug: slug.trim(),
    title,
    client: (d.client as string).trim(),
    category: d.category as ProjectCategory,
    summary: (d.summary as string).trim(),
    year: (d.year as string).trim(),
    featured: d.featured === true,
    cover,
    gallery: normaliseImageArray(d.gallery, `Gallery image from the ${title} case study`),
    challenge: (d.challenge as string).trim(),
    approach: (d.approach as string).trim(),
    outcome: (d.outcome as string).trim(),
    metrics: normaliseMetrics(d.metrics),
    tools: asStringArray(d.tools),
    ...(comparison ? { comparison } : {}),
    ...(video ? { video } : {}),
  };
}

function normaliseService(raw: unknown): Service | null {
  if (!raw || typeof raw !== 'object') return null;
  const d = raw as Record<string, unknown>;

  if (!isNonEmptyString(d.slug)) {
    warnDropped('service', 'missing slug', d.title);
    return null;
  }
  for (const key of ['title', 'description', 'turnaround'] as const) {
    if (!isNonEmptyString(d[key])) {
      warnDropped('service', `missing required field "${key}"`, d.slug);
      return null;
    }
  }

  // An unknown icon name degrades to a neutral one — not worth dropping a whole
  // service card over a typo in a dropdown.
  const icon: IconName =
    isNonEmptyString(d.icon) && VALID_ICONS.has(d.icon) ? (d.icon as IconName) : 'sparkles';

  return {
    slug: (d.slug as string).trim(),
    title: (d.title as string).trim(),
    description: (d.description as string).trim(),
    icon,
    includes: asStringArray(d.includes),
    ...(isNonEmptyString(d.startingAt) ? { startingAt: (d.startingAt as string).trim() } : {}),
    turnaround: (d.turnaround as string).trim(),
  };
}

function normaliseProcessStep(raw: unknown): ProcessStep | null {
  if (!raw || typeof raw !== 'object') return null;
  const d = raw as Record<string, unknown>;

  const order = typeof d.order === 'number' && Number.isFinite(d.order) ? Math.trunc(d.order) : null;
  if (order === null || order < 1) {
    warnDropped('process step', 'step number must be a positive integer', d.title);
    return null;
  }
  for (const key of ['title', 'description', 'duration'] as const) {
    if (!isNonEmptyString(d[key])) {
      warnDropped('process step', `missing required field "${key}"`, order);
      return null;
    }
  }

  return {
    order,
    title: (d.title as string).trim(),
    description: (d.description as string).trim(),
    ...(isNonEmptyString(d.clientAction) ? { clientAction: (d.clientAction as string).trim() } : {}),
    duration: (d.duration as string).trim(),
  };
}

function normaliseTestimonial(raw: unknown): Testimonial | null {
  if (!raw || typeof raw !== 'object') return null;
  const d = raw as Record<string, unknown>;

  if (!isNonEmptyString(d.id)) {
    warnDropped('testimonial', 'missing document id', d.author);
    return null;
  }
  for (const key of ['quote', 'author', 'role'] as const) {
    if (!isNonEmptyString(d[key])) {
      warnDropped('testimonial', `missing required field "${key}"`, d.id);
      return null;
    }
  }

  // Clamp rather than reject — a rating of 7 is a data-entry slip, not a reason
  // to hide a real client's words.
  const rawRating = typeof d.rating === 'number' && Number.isFinite(d.rating) ? Math.trunc(d.rating) : 5;
  const rating = Math.min(5, Math.max(1, rawRating)) as Testimonial['rating'];

  const author = (d.author as string).trim();
  const avatar = normaliseImage(d.avatar, `Portrait of ${author}`);

  return {
    id: (d.id as string).trim(),
    quote: (d.quote as string).trim(),
    author,
    role: (d.role as string).trim(),
    rating,
    ...(avatar ? { avatar } : {}),
    ...(isNonEmptyString(d.source) ? { source: (d.source as string).trim() } : {}),
  };
}

function normaliseTool(raw: unknown): Tool | null {
  if (!raw || typeof raw !== 'object') return null;
  const d = raw as Record<string, unknown>;

  if (!isNonEmptyString(d.name) || !isNonEmptyString(d.purpose)) {
    warnDropped('tool', 'name and purpose are both required', d.name);
    return null;
  }
  const group: Tool['group'] =
    isNonEmptyString(d.group) && VALID_TOOL_GROUPS.has(d.group)
      ? (d.group as Tool['group'])
      : 'generation';

  return {
    name: (d.name as string).trim(),
    purpose: (d.purpose as string).trim(),
    group,
  };
}

/* ── Fetch with fallback ──────────────────────────────────────────────────── */

/**
 * Run a GROQ query and normalise the result, falling back to local data on any
 * failure — including an empty result set, which almost always means "the
 * dataset exists but nothing has been published yet" rather than "there is
 * genuinely no work to show".
 *
 * Next revalidates every hour. Content changes are not urgent enough to
 * warrant per-request fetching, and an hour keeps the CDN doing its job.
 */
async function fetchOrFallback<T>(
  kind: string,
  query: string,
  normalise: (raw: unknown) => T | null,
  fallback: T[],
): Promise<T[]> {
  if (!sanityClient) return fallback;

  try {
    const raw = await sanityClient.fetch<unknown[]>(query, {}, { next: { revalidate: 3600 } });
    if (!Array.isArray(raw) || raw.length === 0) {
      // eslint-disable-next-line no-console
      console.warn(`[content] Sanity returned no ${kind} — using local data from data/.`);
      return fallback;
    }

    const normalised: T[] = [];
    for (const entry of raw) {
      const item = normalise(entry);
      if (item) normalised.push(item);
    }

    if (normalised.length === 0) {
      // eslint-disable-next-line no-console
      console.warn(
        `[content] Every ${kind} document from Sanity failed validation — using local data from data/.`,
      );
      return fallback;
    }
    return normalised;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(
      `[content] Sanity fetch for ${kind} failed, serving local data instead:`,
      error instanceof Error ? error.message : error,
    );
    return fallback;
  }
}

/* ── Public getters — the only API components should use ───────────────────── */

export async function getProjects(): Promise<Project[]> {
  return fetchOrFallback('projects', PROJECTS_QUERY, normaliseProject, localProjects);
}

export async function getServices(): Promise<Service[]> {
  return fetchOrFallback('services', SERVICES_QUERY, normaliseService, localServices);
}

export async function getProcess(): Promise<ProcessStep[]> {
  const steps = await fetchOrFallback('process steps', PROCESS_QUERY, normaliseProcessStep, localProcess);
  // Sort defensively: the GROQ query orders by `order`, but a hand-edited local
  // file might not, and the timeline numerals must match the visual sequence.
  return [...steps].sort((a, b) => a.order - b.order);
}

/**
 * Testimonials are the one collection allowed to come back empty — the local
 * file ships empty on purpose, since inventing client quotes is not an option.
 * The section component returns null on an empty array, so nothing breaks.
 */
export async function getTestimonials(): Promise<Testimonial[]> {
  if (!sanityClient) return localTestimonials;

  try {
    const raw = await sanityClient.fetch<unknown[]>(
      TESTIMONIALS_QUERY,
      {},
      { next: { revalidate: 3600 } },
    );
    if (!Array.isArray(raw)) return localTestimonials;

    const out: Testimonial[] = [];
    for (const entry of raw) {
      const item = normaliseTestimonial(entry);
      if (item) out.push(item);
    }
    // Unlike the others, an empty result is a legitimate state here.
    return out.length > 0 ? out : localTestimonials;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(
      '[content] Sanity fetch for testimonials failed, serving local data instead:',
      error instanceof Error ? error.message : error,
    );
    return localTestimonials;
  }
}

export async function getTools(): Promise<Tool[]> {
  return fetchOrFallback('tools', TOOLS_QUERY, normaliseTool, localTools);
}

/**
 * Everything at once, fetched in parallel.
 *
 * The home page is one server component rendering nine sections, so a single
 * `Promise.all` is one waterfall instead of five sequential round trips.
 */
export async function getSiteContent(): Promise<SiteContent> {
  const [projects, services, processSteps, testimonials, tools] = await Promise.all([
    getProjects(),
    getServices(),
    getProcess(),
    getTestimonials(),
    getTools(),
  ]);
  return { projects, services, process: processSteps, testimonials, tools };
}

export * from './types';
