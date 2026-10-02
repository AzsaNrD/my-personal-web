'use client';

import { Disc3, ExternalLink } from 'lucide-react';
import type { LastfmTrack } from '@/lib/integrations/lastfm';
import { usePolledFetchState } from '@/lib/hooks/use-polled-fetch';
import { LASTFM_POLL_INTERVAL_MS } from '@/lib/constants';
import { Equalizer } from '@/components/ui/equalizer';
import { LoadingImage } from '@/components/ui/loading-image';
import { UpdatedAgo } from '@/components/ui/updated-ago';
import { Tilt } from '@/components/ui/tilt';

type Response = { track: LastfmTrack | null };

export function NowPlayingCard({ initialTrack }: { initialTrack: LastfmTrack | null }) {
  const {
    data: { track },
    updatedAt,
  } = usePolledFetchState<Response>(
    '/api/lastfm/now',
    { track: initialTrack },
    LASTFM_POLL_INTERVAL_MS,
    { fetchOnMount: true },
  );

  if (!track) {
    return (
      <p className="text-muted-foreground border-border rounded-xl border border-dashed p-6 text-sm">
        No recent track found.
      </p>
    );
  }

  return (
    <Tilt max={3}>
      <a
        href={track.url}
        target="_blank"
        rel="noreferrer noopener"
        className="glass glass-hover group flex items-center gap-4 rounded-xl p-4"
      >
        {track.image ? (
          <LoadingImage
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
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
            {track.nowPlaying ? (
              <span className="text-primary inline-flex items-center gap-2">
                <Equalizer />
                <span className="font-mono text-[10px] tracking-wider uppercase">now playing</span>
              </span>
            ) : (
              <span className="text-muted-foreground font-mono text-[10px] tracking-wider uppercase">
                last played
              </span>
            )}
            <UpdatedAgo at={updatedAt} className="sm:ml-auto" />
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
    </Tilt>
  );
}
