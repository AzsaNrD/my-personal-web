'use client';

import Image from 'next/image';
import { Disc3 } from 'lucide-react';
import type { LastfmTrack } from '@/lib/integrations/lastfm';
import { usePolledFetch } from '@/lib/hooks/use-polled-fetch';
import { LASTFM_POLL_INTERVAL_MS } from '@/lib/constants';

type Response = { track: LastfmTrack | null } | null;

export function NowPlaying() {
  const data = usePolledFetch<Response>('/api/lastfm/now', null, LASTFM_POLL_INTERVAL_MS, {
    fetchOnMount: true,
  });

  if (data === null) {
    return <span className="text-muted-foreground/80 tracking-wider uppercase">Loading...</span>;
  }
  if (!data.track) {
    return (
      <span className="text-muted-foreground/80 tracking-wider uppercase">No recent track</span>
    );
  }

  const track = data.track;

  return (
    <>
      {track.nowPlaying ? (
        <span className="inline-flex shrink-0 items-center gap-1.5 tracking-wider text-green-400 uppercase">
          <span className="relative flex size-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400/70" />
            <span className="relative inline-flex size-2 rounded-full bg-green-400" />
          </span>
          Now playing
        </span>
      ) : (
        <span className="text-muted-foreground/80 shrink-0 tracking-wider uppercase">
          Last played
        </span>
      )}
      <a
        href={track.url}
        target="_blank"
        rel="noreferrer noopener"
        className="hover:text-primary inline-flex max-w-full min-w-0 items-center gap-2 transition-colors"
      >
        {track.image ? (
          <Image
            src={track.image}
            alt={`${track.name} cover`}
            width={20}
            height={20}
            className="size-5 shrink-0 rounded-sm object-cover"
            unoptimized
          />
        ) : (
          <span className="bg-muted text-muted-foreground/60 inline-flex size-5 shrink-0 items-center justify-center rounded-sm">
            <Disc3 size={12} aria-hidden />
          </span>
        )}
        <span className="text-foreground truncate">{track.name}</span>
        <span className="text-muted-foreground shrink-0">·</span>
        <span className="text-muted-foreground truncate">{track.artist}</span>
      </a>
    </>
  );
}
