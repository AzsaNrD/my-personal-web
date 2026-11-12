'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

/** Home gets the widest canvas, dashboard-style pages a wide one; reading pages keep the narrow column. */
export function containerWidth(pathname: string) {
  if (pathname === '/') return 'max-w-6xl';
  if (['/misc', '/pay', '/kuliah'].some((p) => pathname.startsWith(p))) return 'max-w-5xl';
  return 'max-w-3xl';
}

export function SiteContainer({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div
      className={cn('mx-auto flex w-full flex-1 flex-col px-5 sm:px-6', containerWidth(pathname))}
    >
      {children}
    </div>
  );
}
