'use client';

import { motion, useScroll, useSpring } from 'motion/react';

/** Thin neon bar pinned to the bottom edge of the navbar, filled by scroll position. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-[var(--primary)] via-[var(--cyan)] to-[var(--magenta)] shadow-[0_0_10px_var(--glow-strong)]"
    />
  );
}
