'use client';

/**
 * Scroll-triggered reveal.
 *
 * WHY `whileInView` AND NOT A SCROLL-LINKED TRANSFORM
 * ──────────────────────────────────────────────────
 * A scroll-linked animation (useScroll → useTransform) runs work on every
 * scroll frame for every element bound to it. `whileInView` uses an
 * IntersectionObserver under the hood: it fires once when the element crosses
 * the threshold and then stops. On a page with 40 revealing elements that is
 * the difference between a smooth scroll and a stuttering one, which is exactly
 * the "nothing that hurts performance" constraint in the brief.
 *
 * `once: true` also means content that has appeared stays put. Re-animating on
 * every pass up and down the page is a common and irritating default.
 *
 * REDUCED MOTION
 * ──────────────
 * When the OS asks for reduced motion the element renders at its final state
 * immediately — opacity 1, no transform, no transition. It does not render a
 * faster animation; it renders no animation. The content is never hidden behind
 * a preference, which is the failure mode where a reveal library leaves
 * `opacity: 0` on the page forever.
 */

import { motion, useReducedMotion, type Variants } from 'framer-motion';

import { cn } from '@/lib/utils';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Seconds to wait before starting. Use small values — 0.05 to 0.3. */
  delay?: number;
  /** Travel distance in pixels. Kept small; large slides feel cheap. */
  distance?: number;
  direction?: Direction;
  /** Render as something other than a div, e.g. 'li' inside a list. */
  as?: 'div' | 'li' | 'section' | 'article' | 'span';
}

function offsetFor(direction: Direction, distance: number) {
  switch (direction) {
    case 'up':
      return { y: distance };
    case 'down':
      return { y: -distance };
    case 'left':
      return { x: distance };
    case 'right':
      return { x: -distance };
    default:
      return {};
  }
}

export function Reveal({
  children,
  className,
  delay = 0,
  distance = 18,
  direction = 'up',
  as = 'div',
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const MotionTag = motion[as];

  if (reduceMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const variants: Variants = {
    hidden: { opacity: 0, ...offsetFor(direction, distance) },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      // -12% bottom margin means the reveal starts just before the element is
      // fully on screen, so it is already settled by the time it is read.
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      variants={variants}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Staggered container for grids and lists.
 *
 * The stagger is defined on the parent rather than by giving each child an
 * incrementing `delay` prop, because a per-child delay computed from its index
 * breaks the moment the list is filtered — item 7 becomes item 2 and still waits
 * 0.42s. `staggerChildren` is positional at animation time, so it stays correct.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.07,
  as = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  as?: 'div' | 'ul' | 'ol';
}) {
  const reduceMotion = useReducedMotion();
  const MotionTag = motion[as];

  if (reduceMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: 0.04 } },
      }}
    >
      {children}
    </MotionTag>
  );
}

/** A child of RevealGroup. Inherits timing from the parent's stagger. */
export function RevealItem({
  children,
  className,
  as = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'li' | 'article';
}) {
  const reduceMotion = useReducedMotion();
  const MotionTag = motion[as];

  if (reduceMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
      }}
    >
      {children}
    </MotionTag>
  );
}

/** Shared section heading block — eyebrow, title, optional lead paragraph. */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = 'left',
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: string;
  align?: 'left' | 'center';
  className?: string;
}) {
  return (
    <Reveal className={cn(align === 'center' && 'mx-auto text-center', 'max-w-3xl', className)}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-3 text-display-md text-ink">{title}</h2>
      {lead && <p className="mt-4 text-body-lg text-ink-soft">{lead}</p>}
    </Reveal>
  );
}
