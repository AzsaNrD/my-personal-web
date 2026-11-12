'use client';

import { useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Fades the page in on client-side navigations only. Fading on the first load would hide the
 * whole page behind opacity 0 and delay when the browser counts its content as painted.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const firstPath = useRef(pathname);
  const navigated = useRef(false);
  if (pathname !== firstPath.current) navigated.current = true;

  return (
    <div
      key={pathname}
      className={navigated.current ? 'animate-[page-fade_0.2s_ease-out]' : undefined}
    >
      {children}
    </div>
  );
}
