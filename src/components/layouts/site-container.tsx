'use client';

import { useSelectedLayoutSegments } from 'next/navigation';
import { cn } from '@/lib/utils';

/**
 * Top-level section of the current route ('' for home), read from the route tree rather than the
 * request URL. `usePathname()` can differ between prerenders (the production home page rendered
 * with a pathname other than "/", so it came out narrow and with no active nav link), and React
 * does not patch mismatched attributes on hydration. The route tree is the same every time.
 */
export function useSection(): string {
  const segments = useSelectedLayoutSegments();
  return segments.find((s) => !s.startsWith('(') && s !== '__PAGE__') ?? '';
}

/** Home gets the widest canvas, dashboard-style pages a wide one; reading pages keep the narrow column. */
export function containerWidth(section: string) {
  if (section === '') return 'max-w-6xl';
  if (['misc', 'pay', 'kuliah', 'guestbook'].includes(section)) return 'max-w-5xl';
  return 'max-w-3xl';
}

export function SiteContainer({ children }: { children: React.ReactNode }) {
  const section = useSection();
  return (
    <div
      className={cn('mx-auto flex w-full flex-1 flex-col px-5 sm:px-6', containerWidth(section))}
    >
      {children}
    </div>
  );
}
