'use client';

import { Disc3, Music2 } from 'lucide-react';
import type { LastfmTrack } from '@/lib/integrations/lastfm';
import { usePolledFetch } from '@/lib/hooks/use-polled-fetch';
import { LASTFM_POLL_INTERVAL_MS } from '@/lib/constants';
import { cn, formatRelative } from '@/lib/utils';
import { lastfmThumb } from '@/lib/lastfm-image';
import { Equalizer } from '@/components/ui/equalizer';
import { LoadingImage } from '@/components/ui/loading-image';

type Response = { track: LastfmTrack | null } | null;

const DAY_MS = 24 * 60 * 60 * 1000;

export function NowPlaying() {
  const data = usePolledFetch<Response>('/api/lastfm/now', null, LASTFM_POLL_INTERVAL_MS, {
    fetchOnMount: true,
  });

  const track = data?.track ?? null;
  // playedAt is a Date on the server but an ISO string once it has crossed the API.
  const playedAt = track?.playedAt ? new Date(track.playedAt) : null;
  const isStale =
    !track?.nowPlaying && playedAt !== null && Date.now() - playedAt.getTime() > DAY_MS;

  return (
    <div
      className={cn(
        'border-border bg-secondary/40 text-muted-foreground mt-7 inline-flex min-h-14 max-w-full flex-wrap items-center gap-x-2 gap-y-1 border px-3 py-1.5 font-mono text-xs transition-colors sm:min-h-10 sm:flex-nowrap',
        track?.nowPlaying &&
          'np-border bg-primary/5 border-transparent py-2 shadow-[0_0_24px_-8px_var(--glow-strong)]',
        isStale && 'opacity-70',
      )}
    >
      <Music2 size={13} className="text-primary shrink-0" aria-hidden />
      <NowPlayingContent data={data} track={track} playedAt={playedAt} />
    </div>
  );
}

function NowPlayingContent({
  data,
  track,
  playedAt,
}: {
  data: Response;
  track: LastfmTrack | null;
  playedAt: Date | null;
}) {
  if (data === null) {
    return <span className="text-muted-foreground/80 tracking-wider uppercase">Loading...</span>;
  }
  if (!track) {
    return (
      <span className="text-muted-foreground/80 tracking-wider uppercase">No recent track</span>
    );
  }

  return (
    <>
      {track.nowPlaying ? (
        <span className="text-primary inline-flex shrink-0 items-center gap-2 tracking-wider uppercase">
          <Equalizer />
          Now playing
        </span>
      ) : (
        <span className="text-muted-foreground/80 shrink-0 tracking-wider uppercase">
          Last played{playedAt ? ` · ${formatRelative(playedAt)}` : ''}
        </span>
      )}
      <a
        href={track.url}
        target="_blank"
        rel="noreferrer noopener"
        className="hover:text-primary inline-flex max-w-full min-w-0 basis-full items-center gap-2 transition-colors sm:basis-auto"
      >
        <span
          className={cn(
            'inline-flex shrink-0 rounded-md',
            track.nowPlaying && 'np-ring p-[1.5px] shadow-[0_0_12px_-2px_var(--glow-strong)]',
          )}
        >
          {track.image ? (
            <LoadingImage
              src={lastfmThumb(track.image, '64s')}
              alt={`${track.name} cover`}
              width={track.nowPlaying ? 24 : 20}
              height={track.nowPlaying ? 24 : 20}
              className={cn(
                'shrink-0 rounded-[4px] object-cover',
                track.nowPlaying ? 'size-6' : 'size-5',
              )}
              unoptimized
            />
          ) : (
            <span
              className={cn(
                'bg-muted text-muted-foreground/60 inline-flex shrink-0 items-center justify-center rounded-[4px]',
                track.nowPlaying ? 'size-6' : 'size-5',
              )}
            >
              <Disc3 size={12} aria-hidden />
            </span>
          )}
        </span>
        <span className="text-foreground truncate">{track.name}</span>
        <span className="text-muted-foreground shrink-0">·</span>
        <span className="text-muted-foreground truncate">{track.artist}</span>
      </a>
    </>
  );
}
