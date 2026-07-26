'use client';

import { useEffect, useState } from 'react';

type Options = {
  fetchOnMount?: boolean;
};

export function usePolledFetch<T>(
  url: string,
  initialData: T,
  intervalMs: number,
  { fetchOnMount = false }: Options = {},
): T {
  const [data, setData] = useState<T>(initialData);

  useEffect(() => {
    let cancelled = false;
    const fetchOnce = async () => {
      try {
        const res = await fetch(url, { cache: 'no-store' });
        const json = (await res.json()) as T;
        if (!cancelled) setData(json);
      } catch {
        // keep last known good state on transient errors
      }
    };
    if (fetchOnMount) fetchOnce();
    const id = setInterval(fetchOnce, intervalMs);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [url, intervalMs, fetchOnMount]);

  return data;
}
