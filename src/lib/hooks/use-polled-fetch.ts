'use client';

import { useEffect, useState } from 'react';

type Options = {
  fetchOnMount?: boolean;
};

type PolledState<T> = { data: T; updatedAt: number | null };

/** Like `usePolledFetch`, plus the time of the last successful fetch (null until one succeeds). */
export function usePolledFetchState<T>(
  url: string,
  initialData: T,
  intervalMs: number,
  { fetchOnMount = false }: Options = {},
): PolledState<T> {
  const [state, setState] = useState<PolledState<T>>({ data: initialData, updatedAt: null });

  useEffect(() => {
    let cancelled = false;
    const fetchOnce = async () => {
      try {
        const res = await fetch(url, { cache: 'no-store' });
        const json = (await res.json()) as T;
        if (!cancelled) setState({ data: json, updatedAt: Date.now() });
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

  return state;
}

export function usePolledFetch<T>(
  url: string,
  initialData: T,
  intervalMs: number,
  options?: Options,
): T {
  return usePolledFetchState(url, initialData, intervalMs, options).data;
}
