/**
 * Icon resolver for CMS-supplied icon names.
 *
 * WHY A MAP INSTEAD OF A DYNAMIC IMPORT
 * ─────────────────────────────────────
 * `lucide-react` exports well over a thousand icons. Importing by computed name
 * (`Icons[name]`) pulls the entire barrel into the bundle because a bundler
 * cannot tree-shake an index it cannot statically resolve. An explicit map of
 * the eight icons actually used keeps the shipped JS to those eight.
 *
 * The `IconName` union in lib/content/types.ts makes the keys exhaustive at
 * compile time, and the adapter already degrades an unrecognised CMS value to
 * 'sparkles', so a bad name in Sanity produces a generic icon rather than a
 * blank card or a crash.
 */

import {
  Camera,
  Film,
  Layers,
  LayoutTemplate,
  Shield,
  Sparkles,
  Wand2,
  Zap,
  type LucideIcon,
} from 'lucide-react';

import type { IconName } from '@/lib/content/types';

const ICONS: Record<IconName, LucideIcon> = {
  camera: Camera,
  sparkles: Sparkles,
  film: Film,
  layout: LayoutTemplate,
  wand: Wand2,
  layers: Layers,
  zap: Zap,
  shield: Shield,
};

export function Icon({
  name,
  className,
}: {
  name: IconName;
  className?: string;
}) {
  const Component = ICONS[name] ?? Sparkles;
  // Decorative in every current usage — the adjacent heading carries the
  // meaning, so announcing the icon would just duplicate it.
  return <Component className={className} aria-hidden="true" />;
}
