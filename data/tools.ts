/**
 * The actual working stack, rendered as a grouped badge row.
 *
 * Grouped rather than listed flat, because "what you generate with" and "what
 * you ship on" are different claims and clients read them differently.
 */

import type { Tool } from '@/lib/content/types';

export const tools: Tool[] = [
  /* ── Generation ─────────────────────────────────────────────────────────── */
  { name: 'Higgsfield', purpose: 'Primary generation engine for product and fashion sets', group: 'generation' },
  { name: 'Nano Banana Pro', purpose: 'High-fidelity garment and product rendering', group: 'generation' },
  { name: 'ComfyUI', purpose: 'Local batch pipelines and node-level control', group: 'generation' },
  { name: 'Prompt systems', purpose: 'Reference locking, hex locking, angle control', group: 'generation' },

  /* ── Post ───────────────────────────────────────────────────────────────── */
  { name: 'Photoshop', purpose: 'Targeted correction and composite work', group: 'post' },
  { name: 'AI upscaling', purpose: 'Recovering detail from weak source files', group: 'post' },
  { name: 'Colour management', purpose: 'Background hex and skin-tone consistency', group: 'post' },
  { name: 'Canva', purpose: 'Fast social and campaign layouts', group: 'post' },

  /* ── Build ──────────────────────────────────────────────────────────────── */
  { name: 'Next.js', purpose: 'App Router front ends with server-rendered pages', group: 'build' },
  { name: 'TypeScript', purpose: 'Typed end to end, strict mode on', group: 'build' },
  { name: 'Tailwind CSS', purpose: 'Design-token-driven styling', group: 'build' },
  { name: 'Sanity', purpose: 'Structured content clients can actually edit', group: 'build' },
  { name: 'Python', purpose: 'Batch tooling, renaming and QA contact sheets', group: 'build' },

  /* ── Delivery ───────────────────────────────────────────────────────────── */
  { name: 'Vercel', purpose: 'Deployment, edge caching and preview builds', group: 'delivery' },
  { name: 'Upwork', purpose: 'Contracted delivery with milestone approval', group: 'delivery' },
  { name: 'Git', purpose: 'Version control on every build', group: 'delivery' },
];

/** Human labels for the group headings. */
export const TOOL_GROUP_LABELS: Record<Tool['group'], string> = {
  generation: 'Generation',
  post: 'Post & correction',
  build: 'Build',
  delivery: 'Delivery',
};

/** Render order for the groups. */
export const TOOL_GROUP_ORDER: readonly Tool['group'][] = [
  'generation',
  'post',
  'build',
  'delivery',
] as const;
