'use client';

/**
 * Animated background motif for the hero.
 *
 * WHAT IT IS
 * ──────────
 * Three soft gold light-wells drifting slowly behind an aperture-like ring of
 * arcs — a lens diaphragm abstracted, which reads as "photography" without
 * being a camera icon.
 *
 * WHY IT IS CHEAP
 * ───────────────
 * Everything animated is `transform` and `opacity` only. Both are composited on
 * the GPU, so no frame of this triggers layout or paint. Nothing animates
 * `filter`, `box-shadow`, `width` or `background-position`, which are the four
 * properties that turn a decorative background into a scroll-stutter.
 *
 * The blur is a static `blur-3xl` utility, applied once at paint. Animating a
 * blur radius is the classic mistake here: it forces a re-rasterise every frame
 * and will tank the frame rate on a mid-range Android.
 *
 * `will-change` is deliberately NOT set. On a permanently-running animation it
 * pins a compositor layer for the life of the page and costs memory for no
 * measurable gain, since the transform already promotes the layer.
 *
 * ACCESSIBILITY
 * ─────────────
 * Purely decorative, so `aria-hidden` and `pointer-events-none`. Under reduced
 * motion the composition still renders — the layout would look empty without it
 * — but every animation is dropped and the elements sit at their rest position.
 */

import { motion, useReducedMotion } from 'framer-motion';

/**
 * Rest positions and drift paths for the three light-wells.
 *
 * Deliberately NOT `as const`: Framer's keyframe arrays are typed as mutable, so
 * a readonly tuple is rejected. The interface below gives the same authoring
 * safety without freezing the arrays.
 */
interface Well {
  className: string;
  drift: { x: number[]; y: number[] };
  duration: number;
}

const WELLS: Well[] = [
  {
    className: 'left-[-12%] top-[-18%] h-[34rem] w-[34rem] bg-gold/[0.14]',
    drift: { x: [0, 34, -18, 0], y: [0, -22, 16, 0] },
    duration: 26,
  },
  {
    className: 'right-[-14%] top-[6%] h-[28rem] w-[28rem] bg-gold/[0.10]',
    drift: { x: [0, -26, 18, 0], y: [0, 24, -14, 0] },
    duration: 32,
  },
  {
    className: 'left-[32%] bottom-[-24%] h-[26rem] w-[26rem] bg-gold/[0.07]',
    drift: { x: [0, 20, -22, 0], y: [0, -16, 10, 0] },
    duration: 38,
  },
];

export function HeroMotif() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* ── Light wells ──────────────────────────────────────────────────── */}
      {WELLS.map((well, index) => (
        <motion.div
          key={index}
          className={`absolute rounded-full blur-3xl ${well.className}`}
          animate={reduceMotion ? undefined : well.drift}
          transition={{
            duration: well.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            // Offsetting each well's start stops all three cresting together,
            // which would read as one pulsing blob rather than drift.
            delay: index * 2.5,
          }}
        />
      ))}

      {/* ── Aperture ─────────────────────────────────────────────────────── */}
      <motion.svg
        viewBox="0 0 400 400"
        className="absolute right-[-18%] top-[4%] h-[30rem] w-[30rem] opacity-[0.16] sm:right-[-6%] sm:h-[34rem] sm:w-[34rem]"
        // A very slow full rotation. 120s is slow enough that it is never the
        // thing you notice, only something you sense if you sit still.
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
      >
        {/* Six blades at 60° intervals, drawn as arcs rather than a full circle
            so the shape reads as a diaphragm. */}
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <g key={angle} transform={`rotate(${angle} 200 200)`}>
            <path
              d="M200 44 A156 156 0 0 1 335 122"
              fill="none"
              stroke="rgb(var(--gold))"
              strokeWidth="1.25"
              strokeLinecap="round"
            />
          </g>
        ))}
        <circle
          cx="200"
          cy="200"
          r="92"
          fill="none"
          stroke="rgb(var(--gold))"
          strokeWidth="0.75"
          strokeDasharray="2 7"
        />
        <circle cx="200" cy="200" r="34" fill="none" stroke="rgb(var(--gold))" strokeWidth="1" />
      </motion.svg>

      {/* ── Grid ─────────────────────────────────────────────────────────────
          A static hairline grid, masked to fade out before it reaches the text.
          Pure CSS gradients — no image request, and it costs one paint. */}
      <div
        className="absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgb(var(--line)) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--line)) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 70% 55% at 62% 38%, black 0%, transparent 72%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 55% at 62% 38%, black 0%, transparent 72%)',
        }}
      />

      {/* Bottom fade so the hero dissolves into the next section rather than
          ending on a hard edge. */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-canvas" />
    </div>
  );
}
