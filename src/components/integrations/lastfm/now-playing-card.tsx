'use client';

import Image from 'next/image';
import { Disc3, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Visualizer } from '@/components/ui/visualizer';
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
        className={cn(
          'hud-panel hud-corners group flex items-center gap-4 p-4 outline-none',
          track.nowPlaying && 'pb-9',
        )}
      >
        {track.nowPlaying ? (
          <>
            {/* Blurred cover as ambient light; its own clipping wrapper keeps the corner brackets visible. */}
            <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
              {track.image ? (
                <Image
                  src={track.image}
                  alt=""
                  width={80}
                  height={80}
                  unoptimized
                  className="absolute inset-0 size-full scale-150 object-cover opacity-30 blur-2xl saturate-150"
                />
              ) : null}
              <span className="from-primary/10 absolute inset-0 bg-gradient-to-r to-transparent" />
              <Visualizer className="absolute inset-x-4 bottom-0 h-6 opacity-50" />
            </span>
          </>
        ) : null}
        <span
          className={cn(
            'relative inline-flex shrink-0 rounded-lg',
            track.nowPlaying && 'np-ring p-[3px] shadow-[0_0_28px_-6px_var(--glow-strong)]',
          )}
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
        </span>
        <div className="relative min-w-0 flex-1">
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
            {track.nowPlaying ? (
              <UpdatedAgo at={updatedAt} className="sm:ml-auto" />
            ) : (
              <UpdatedAgo
                at={track.playedAt ? new Date(track.playedAt).getTime() : null}
                label=""
                className="sm:ml-auto"
              />
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
        <ExternalLink size={16} className="text-muted-foreground relative shrink-0" aria-hidden />
      </a>
    </Tilt>
  );
}
