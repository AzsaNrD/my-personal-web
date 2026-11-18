'use client';

import { useEffect, useRef } from 'react';
import { ArrowUp } from 'lucide-react';

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Longer pages take a little longer, but never snap and never drag. */
const durationFor = (distance: number) => Math.min(1200, Math.max(600, 500 + distance * 0.2));

/**
 * Scrolls to the top with an eased animation instead of an instant jump. Falls back to the
 * `#top` anchor without JavaScript, jumps straight there for reduced motion, and hands control
 * back the moment the visitor scrolls or touches the page.
 */
export function BackToTop({ className }: { className?: string }) {
  const cancelRef = useRef<(() => void) | null>(null);

  useEffect(() => () => cancelRef.current?.(), []);

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    cancelRef.current?.();

    const start = window.scrollY;
    if (start === 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.scrollTo(0, 0);
      return;
    }

    const duration = durationFor(start);
    const startedAt = performance.now();
    let raf = 0;

    const stop = () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('wheel', stop);
      window.removeEventListener('touchstart', stop);
      window.removeEventListener('keydown', stop);
      cancelRef.current = null;
    };

    const step = (now: number) => {
      const t = Math.min((now - startedAt) / duration, 1);
      window.scrollTo(0, Math.round(start * (1 - easeInOutCubic(t))));
      if (t < 1) raf = requestAnimationFrame(step);
      else stop();
    };

    window.addEventListener('wheel', stop, { passive: true });
    window.addEventListener('touchstart', stop, { passive: true });
    window.addEventListener('keydown', stop);
    cancelRef.current = stop;
    raf = requestAnimationFrame(step);
  }

  return (
    <a href="#top" aria-label="Back to top" onClick={handleClick} className={className}>
      <ArrowUp
        size={15}
        aria-hidden
        className="transition-transform duration-200 group-hover/top:-translate-y-0.5"
      />
    </a>
  );
}
