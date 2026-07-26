'use client';

import Image from 'next/image';
import { Disc3, ExternalLink } from 'lucide-react';
import type { LastfmTrack } from '@/lib/integrations/lastfm';
import { usePolledFetch } from '@/lib/hooks/use-polled-fetch';
import { LASTFM_POLL_INTERVAL_MS } from '@/lib/constants';

type Response = { track: LastfmTrack | null };

export function NowPlayingCard({ initialTrack }: { initialTrack: LastfmTrack | null }) {
  const { track } = usePolledFetch<Response>(
    '/api/lastfm/now',
    { track: initialTrack },
    LASTFM_POLL_INTERVAL_MS,
  );

  if (!track) {
    return (
      <p className="text-muted-foreground border-border rounded-xl border border-dashed p-6 text-sm">
        No recent track found.
      </p>
    );
  }

  return (
    <a
      href={track.url}
      target="_blank"
      rel="noreferrer noopener"
      className="border-border hover:border-primary/40 group flex items-center gap-4 rounded-xl border p-4 transition-colors"
    >
      {track.image ? (
        <Image
          src={track.image}
          alt={`${track.name} cover`}
          width={80}
          height={80}
          unoptimized
          priority
          className="size-20 shrink-0 rounded-md object-cover"
        />
      ) : (
        <span className="bg-muted text-muted-foreground/60 inline-flex size-20 shrink-0 items-center justify-center rounded-md">
          <Disc3 size={36} aria-hidden />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {track.nowPlaying ? (
            <span className="inline-flex items-center gap-1.5">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400/70" />
                <span className="relative inline-flex size-2 rounded-full bg-green-400" />
              </span>
              <span className="font-mono text-[10px] tracking-wider text-green-400 uppercase">
                now playing
              </span>
            </span>
          ) : (
            <span className="text-muted-foreground font-mono text-[10px] tracking-wider uppercase">
              last played
            </span>
          )}
        </div>
        <p className="text-foreground group-hover:text-primary mt-1 truncate text-base font-semibold transition-colors">
          {track.name}
        </p>
        <p className="text-muted-foreground truncate text-sm">
          {track.artist}
          {track.album ? ` · ${track.album}` : ''}
        </p>
      </div>
      <ExternalLink size={16} className="text-muted-foreground shrink-0" aria-hidden />
    </a>
  );
}
