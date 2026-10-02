'use client';

import { Gamepad2 } from 'lucide-react';
import type { SteamPlayer } from '@/lib/integrations/steam';
import { usePolledFetchState } from '@/lib/hooks/use-polled-fetch';
import { STEAM_POLL_INTERVAL_MS } from '@/lib/constants';
import { LoadingImage } from '@/components/ui/loading-image';
import { PulseLine } from '@/components/ui/pulse-line';
import { UpdatedAgo } from '@/components/ui/updated-ago';
import { Tilt } from '@/components/ui/tilt';

type Response = { player: SteamPlayer | null };

export function SteamNowPlaying({ initialPlayer }: { initialPlayer: SteamPlayer | null }) {
  const {
    data: { player },
    updatedAt,
  } = usePolledFetchState<Response>(
    '/api/steam/now',
    { player: initialPlayer },
    STEAM_POLL_INTERVAL_MS,
    {
      fetchOnMount: true,
    },
  );

  if (!player?.currentGame) return null;

  const { currentGame } = player;
  return (
    <Tilt max={3}>
      <a
        href={`https://store.steampowered.com/app/${currentGame.appId}/`}
        target="_blank"
        rel="noreferrer noopener"
        className="glass glass-hover group flex items-center gap-4 rounded-xl p-4"
      >
        <LoadingImage
          src={currentGame.bannerUrl}
          alt={`${currentGame.name} cover`}
          width={184}
          height={69}
          unoptimized
          className="h-[34px] w-[92px] shrink-0 rounded-sm object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
            <span className="text-primary inline-flex items-center gap-2">
              <PulseLine />
              <span className="font-mono text-[10px] tracking-wider uppercase">in game</span>
            </span>
            <UpdatedAgo at={updatedAt} className="sm:ml-auto" />
          </div>
          <p className="text-foreground group-hover:text-primary mt-1 truncate text-base font-semibold transition-colors">
            {currentGame.name}
          </p>
        </div>
        <Gamepad2 size={16} className="text-muted-foreground shrink-0" aria-hidden />
      </a>
    </Tilt>
  );
}
