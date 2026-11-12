'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const StarField = dynamic(() => import('@/components/three/starfield'), { ssr: false });

const FALLBACK_MS = 8000;
const INTERACTION_EVENTS = [
  'pointerdown',
  'pointermove',
  'touchstart',
  'keydown',
  'scroll',
] as const;

/**
 * Fixed starfield behind the whole site. It is decoration, so three.js is only downloaded once the
 * visitor interacts (or after a long fallback), never while the page is still loading and painting.
 */
export function StarBackdrop() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let timeoutId: number | undefined;

    function start() {
      cleanup();
      setMounted(true);
    }
    function cleanup() {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      for (const type of INTERACTION_EVENTS) window.removeEventListener(type, start);
    }

    for (const type of INTERACTION_EVENTS) {
      window.addEventListener(type, start, { once: true, passive: true });
    }
    timeoutId = window.setTimeout(start, FALLBACK_MS);

    return cleanup;
  }, []);

  return mounted ? <StarField /> : null;
}
