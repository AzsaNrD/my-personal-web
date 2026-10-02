'use client';

import { Disc3 } from 'lucide-react';
import type { LastfmTrack } from '@/lib/integrations/lastfm';
import { usePolledFetch } from '@/lib/hooks/use-polled-fetch';
import { LASTFM_POLL_INTERVAL_MS } from '@/lib/constants';
import { Equalizer } from '@/components/ui/equalizer';
import { LoadingImage } from '@/components/ui/loading-image';

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
        <span className="text-primary inline-flex shrink-0 items-center gap-2 tracking-wider uppercase">
          <Equalizer />
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
          <LoadingImage
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
