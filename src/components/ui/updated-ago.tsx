'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

function formatAgo(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  if (s < 5) return 'just now';
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

/** Ticking "Updated 12s ago" label; `at` is the last successful fetch, and nothing shows until there is one. */
export function UpdatedAgo({
  at,
  label = 'Updated',
  className,
}: {
  at: number | null;
  label?: string;
  className?: string;
}) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (at === null) return;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [at]);

  if (at === null) return null;
  return (
    <span className={cn('text-muted-foreground font-mono text-[10px] tabular-nums', className)}>
      {label ? `${label} ` : ''}
      {formatAgo(now - at)}
    </span>
  );
}
