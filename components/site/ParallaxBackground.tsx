'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  LIGHTWEIGHT LIVING PARALLAX BACKGROUND
 * ─────────────────────────────────────────────────────────────────────────────
 *  1. Parallax Travel: Smoothly lags on scroll with spring physics to create 3D depth.
 *  2. Ambient Drift: Constantly moves with a slow, subtle, living breathing wave
 *     ("hlka hlka norbe mane motion e thakbe").
 *  3. GPU-Accelerated: 120 FPS compositor execution with soft lens blur.
 */
export function ParallaxBackground() {
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    mass: 0.4,
    restDelta: 0.001,
  });

  const bgY = useTransform(smoothProgress, [0, 1], ['0%', '-12%']);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none -z-30 overflow-hidden"
      aria-hidden="true"
    >
      {mounted ? (
        /* Layer 1: Parallax scroll-driven vertical travel */
        <motion.div
          style={{ y: bgY }}
          className="absolute inset-x-0 -top-[5%] w-full h-[125%] will-change-transform transform-gpu"
        >
          {/* Layer 2: Continuous living undulating wave motion ("hlka hlka norbe") */}
          <motion.div
            animate={{
              y: [0, -10, 4, -6, 0],
              x: [0, 7, -5, 4, 0],
              scale: [1.04, 1.07, 1.05, 1.075, 1.04],
            }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              backgroundImage: "url('/img/bg/site-bg.png')",
              backgroundPosition: 'center top',
              backgroundSize: '100% auto',
            }}
            className="w-full h-full bg-no-repeat opacity-90 blur-[12px] sm:blur-[14px] will-change-transform transform-gpu"
          />
        </motion.div>
      ) : (
        <div
          className="absolute inset-x-0 -top-[5%] w-full h-[125%] bg-no-repeat opacity-90 blur-[12px] sm:blur-[14px] transform-gpu"
          style={{
            backgroundImage: "url('/img/bg/site-bg.png')",
            backgroundPosition: 'center top',
            backgroundSize: '100% auto',
          }}
        />
      )}
    </div>
  );
}
