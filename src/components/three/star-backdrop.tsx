'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const StarField = dynamic(() => import('@/components/three/starfield'), { ssr: false });

/** Fixed starfield behind the whole site; loaded after first paint so it never delays content. */
export function StarBackdrop() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setMounted(true), 600);
    return () => window.clearTimeout(id);
  }, []);

  return mounted ? <StarField /> : null;
}
