'use client';

import { useMemo } from 'react';
import type { LastfmTrack } from '@/lib/integrations/lastfm';
import { usePolledFetch } from '@/lib/hooks/use-polled-fetch';
import { LASTFM_POLL_INTERVAL_MS } from '@/lib/constants';
import { formatRelative } from '@/lib/utils';
import { lastfmThumb } from '@/lib/lastfm-image';
import { LoadingImage } from '@/components/ui/loading-image';
import { CoverFallback } from '@/components/ui/cover-fallback';

type SerializedTrack = Omit<LastfmTrack, 'playedAt'> & { playedAt: string | null };

function deserialize(t: SerializedTrack): LastfmTrack {
  return { ...t, playedAt: t.playedAt ? new Date(t.playedAt) : null };
}

type Response = { tracks: SerializedTrack[] };

/**
 * Cover wall of recent plays. `limit` is the number of tracks fetched; the first one is dropped
 * because the Now/last played card above already shows it. Tiles past the sixth only show on
 * large screens, where the wall sits beside the top tracks list.
 */
export function RecentTracksList({
  initialTracks,
  limit,
}: {
  initialTracks: LastfmTrack[];
  limit: number;
}) {
  const initialData = useMemo<Response>(
    () => ({
      tracks: initialTracks.map((t) => ({
        ...t,
        playedAt: t.playedAt ? t.playedAt.toISOString() : null,
      })),
    }),
    [initialTracks],
  );
  const data = usePolledFetch<Response>(
    `/api/lastfm/recent?limit=${limit}`,
    initialData,
    LASTFM_POLL_INTERVAL_MS,
  );
  const tracks = useMemo(() => data.tracks.slice(1).map(deserialize), [data.tracks]);

  if (!tracks.length) {
    return <p className="text-muted-foreground text-sm">No recent tracks.</p>;
  }

  return (
    <ul className="grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-3 [&>li:nth-child(n+7)]:hidden lg:[&>li:nth-child(n+7)]:block">
      {tracks.map((t, i) => (
        <li key={`${t.name}-${t.artist}-${i}`}>
          <a
            href={t.url}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`${t.name} by ${t.artist}`}
            className="hud-panel group relative block aspect-square overflow-hidden p-0 outline-none"
          >
            {t.image ? (
              <LoadingImage
                src={lastfmThumb(t.image, '174s')}
                alt=""
                width={174}
                height={174}
                unoptimized
                className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <CoverFallback seed={`${t.name}-${t.artist}`} label={t.name} className="size-full" />
            )}
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/55 to-transparent px-2 pt-6 pb-1.5"
            >
              <span className="block truncate text-xs leading-tight font-medium text-white">
                {t.name}
              </span>
              <span
                suppressHydrationWarning
                className="block truncate font-mono text-[11px] leading-tight text-white/70"
              >
                {t.nowPlaying ? 'now' : t.playedAt ? formatRelative(t.playedAt) : t.artist}
              </span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
