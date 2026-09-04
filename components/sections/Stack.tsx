/**
 * Tech & tools.
 *
 * WHY TEXT BADGES AND NOT LOGOS
 * ─────────────────────────────
 * The brief asked for "a clean logo/badge row". This ships text badges rather
 * than logo images, for three reasons that all point the same way:
 *
 *   1. Legal. Most of these are trademarks. Displaying a company's logo implies
 *      a relationship or endorsement, and several of these vendors' brand
 *      guidelines explicitly forbid it in that context. A text mention does not.
 *   2. Performance. Sixteen logo files means sixteen requests and a set of SVGs
 *      that each need dark-mode variants, for information that is already fully
 *      conveyed by the word.
 *   3. Honesty. A wall of logos reads as "partnered with". A named tool with a
 *      one-line purpose reads as "this is what I use it for", which is the
 *      actual claim.
 *
 * If real logos are wanted later, drop SVGs into public/logos and swap the
 * `<span>` for an `<Image>` — the grouping and layout do not change.
 *
 * Server component. `purpose` is exposed on hover/focus via a title attribute
 * AND rendered in the DOM at all sizes above sm, so the information is not
 * hover-only — a hover-only tooltip is inaccessible on touch.
 */

import { RevealGroup, RevealItem, SectionHeading } from '@/components/ui/Reveal';
import { TOOL_GROUP_LABELS, TOOL_GROUP_ORDER } from '@/data/tools';
import type { Tool } from '@/lib/content/types';

export function Stack({ tools }: { tools: Tool[] }) {
  if (tools.length === 0) return null;

  // Group once, here, rather than filtering the array inside each group's map.
  const grouped = TOOL_GROUP_ORDER.map((group) => ({
    group,
    label: TOOL_GROUP_LABELS[group],
    items: tools.filter((tool) => tool.group === group),
  })).filter((entry) => entry.items.length > 0);

  return (
    <section id="stack" className="section scroll-mt-24 border-t border-line">
      <div className="shell">
        <SectionHeading
          eyebrow="Tech & tools"
          title="The working stack"
          lead="Grouped by what it actually does, because “what I generate with” and “what I ship on” are different claims."
        />

        <RevealGroup className="mt-12 space-y-10 lg:mt-14" stagger={0.08}>
          {grouped.map((entry) => (
            <RevealItem key={entry.group}>
              <div className="grid gap-5 md:grid-cols-12">
                <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-ink md:col-span-3 md:pt-1">
                  {entry.label}
                </h3>

                <ul className="flex flex-wrap gap-2.5 md:col-span-9">
                  {entry.items.map((tool) => (
                    <li key={tool.name}>
                      <span
                        className="group inline-flex items-center gap-2 rounded-pill border border-line bg-surface px-3.5 py-2 transition-colors duration-200 hover:border-gold/45"
                        title={tool.purpose}
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full bg-gold/60 transition-colors group-hover:bg-gold"
                          aria-hidden="true"
                        />
                        <span className="text-sm font-medium text-ink">{tool.name}</span>
                        <span className="hidden text-xs text-ink-muted sm:inline">
                          {tool.purpose}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
