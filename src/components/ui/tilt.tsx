'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

type TiltProps = React.ComponentProps<'div'> & { max?: number };

/** Tilts toward a fine pointer and tracks a specular sheen. Inert on touch and for reduced motion. */
export function Tilt({ className, children, max = 5, ...props }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reduced) return;

    function onMove(e: PointerEvent) {
      const r = el!.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      el!.style.setProperty('--tilt-x', `${((0.5 - y) * 2 * max).toFixed(2)}deg`);
      el!.style.setProperty('--tilt-y', `${((x - 0.5) * 2 * max).toFixed(2)}deg`);
      el!.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
      el!.style.setProperty('--my', `${(y * 100).toFixed(1)}%`);
    }
    function onEnter() {
      el!.dataset.tilting = 'true';
    }
    function onLeave() {
      delete el!.dataset.tilting;
      el!.style.setProperty('--tilt-x', '0deg');
      el!.style.setProperty('--tilt-y', '0deg');
    }

    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [max]);

  return (
    <div ref={ref} className={cn('tilt', className)} {...props}>
      {children}
    </div>
  );
}
