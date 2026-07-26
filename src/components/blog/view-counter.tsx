'use client';

import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';

type Props = {
  slug: string;
  trackView?: boolean;
};

export function ViewCounter({ slug, trackView = false }: Props) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const url = `/api/views/${encodeURIComponent(slug)}`;
    const flagKey = `viewed:${slug}`;

    async function run() {
      const shouldTrack = trackView && !sessionStorage.getItem(flagKey);
      try {
        const res = await fetch(url, { method: shouldTrack ? 'POST' : 'GET' });
        const data = (await res.json()) as { count: number };
        if (!cancelled) setCount(data.count);
        if (shouldTrack) sessionStorage.setItem(flagKey, '1');
      } catch {
        if (!cancelled) setCount(0);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [slug, trackView]);

  return (
    <span className="text-muted-foreground inline-flex items-center gap-1 font-mono text-xs">
      <Eye size={12} aria-hidden />
      <span>{count === null ? '—' : count.toLocaleString('id-ID')} views</span>
    </span>
  );
}
