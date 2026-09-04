/**
 * Page header band for the dedicated routes (/work, /services, /about, /contact).
 *
 * WHY THIS EXISTS AS ITS OWN COMPONENT
 * ────────────────────────────────────
 * Every subpage needs the same two things the home hero already solves but the
 * section components do not: an <h1> (the section components only emit <h2>, which
 * is correct when they sit inside a page but leaves a routed page with no level-1
 * heading), and enough top padding to clear the fixed 4.5rem header. Centralising
 * both here means the pages stay declarative — a title and a lead — and the
 * spacing is fixed in one place rather than copied five times.
 *
 * The heading is `text-balance` so a two-line title breaks evenly instead of
 * leaving one orphan word on the second line.
 */

import { Reveal } from '@/components/ui/Reveal';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  eyebrow: string;
  title: React.ReactNode;
  lead?: string;
  className?: string;
}

export function PageHeader({ eyebrow, title, lead, className }: PageHeaderProps) {
  return (
    <header className={cn('grain relative isolate overflow-hidden', className)}>
      <div className="shell pb-6 pt-28 sm:pb-8 sm:pt-32 lg:pt-36">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-3 text-balance text-display-lg text-ink">{title}</h1>
          {lead && <p className="mt-5 max-w-2xl text-body-lg text-ink-soft">{lead}</p>}
        </Reveal>
      </div>
    </header>
  );
}
