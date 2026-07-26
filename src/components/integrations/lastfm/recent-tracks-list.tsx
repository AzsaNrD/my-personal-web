'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { Disc3 } from 'lucide-react';
import type { LastfmTrack } from '@/lib/integrations/lastfm';
import { usePolledFetch } from '@/lib/hooks/use-polled-fetch';
import { LASTFM_POLL_INTERVAL_MS } from '@/lib/constants';
import { formatRelative } from '@/lib/utils';

type SerializedTrack = Omit<LastfmTrack, 'playedAt'> & { playedAt: string | null };

function deserialize(t: SerializedTrack): LastfmTrack {
  return { ...t, playedAt: t.playedAt ? new Date(t.playedAt) : null };
}

type Response = { tracks: SerializedTrack[] };

export function RecentTracksList({
  initialTracks,
  limit = 4,
}: {
  initialTracks: LastfmTrack[];
  limit?: number;
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
  const tracks = useMemo(() => data.tracks.map(deserialize), [data.tracks]);

  if (!tracks.length) {
    return <p className="text-muted-foreground text-sm">No recent tracks.</p>;
  }

  return (
    <ul className="space-y-2">
      {tracks.map((t, i) => (
        <li key={`${t.name}-${t.artist}-${i}`}>
          <a
            href={t.url}
            target="_blank"
            rel="noreferrer noopener"
            className="border-border hover:border-primary/40 hover:bg-secondary/40 group flex items-center gap-3 rounded-xl border p-3 transition-colors"
          >
            {t.image ? (
              <Image
                src={t.image}
                alt=""
                width={40}
                height={40}
                unoptimized
                className="size-10 shrink-0 rounded-sm object-cover"
              />
            ) : (
              <span className="bg-muted text-muted-foreground/60 inline-flex size-10 shrink-0 items-center justify-center rounded-sm">
                <Disc3 size={20} aria-hidden />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-foreground group-hover:text-primary truncate text-sm font-medium transition-colors">
                {t.name}
              </p>
              <p className="text-muted-foreground truncate text-xs">{t.artist}</p>
            </div>
            <span className="text-muted-foreground shrink-0 font-mono text-xs">
              {t.nowPlaying ? 'now' : t.playedAt ? formatRelative(t.playedAt) : ''}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
