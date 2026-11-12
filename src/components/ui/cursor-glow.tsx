'use client';

import { useEffect, useRef } from 'react';

/** Soft spotlight that follows a fine pointer. Does nothing on touch or for reduced motion. */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;

    let raf = 0;
    let x = 0;
    let y = 0;
    function frame() {
      el!.style.setProperty('--cx', `${x}px`);
      el!.style.setProperty('--cy', `${y}px`);
      raf = 0;
    }
    function onMove(e: PointerEvent) {
      x = e.clientX;
      y = e.clientY;
      el!.dataset.active = 'true';
      if (!raf) raf = requestAnimationFrame(frame);
    }
    function onLeave() {
      el!.dataset.active = 'false';
    }
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} className="cursor-glow" aria-hidden />;
}
