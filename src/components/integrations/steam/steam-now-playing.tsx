'use client';

import Image from 'next/image';
import { Gamepad2 } from 'lucide-react';
import type { SteamPlayer } from '@/lib/integrations/steam';
import { usePolledFetch } from '@/lib/hooks/use-polled-fetch';
import { STEAM_POLL_INTERVAL_MS } from '@/lib/constants';

type Response = { player: SteamPlayer | null };

export function SteamNowPlaying({ initialPlayer }: { initialPlayer: SteamPlayer | null }) {
  const { player } = usePolledFetch<Response>(
    '/api/steam/now',
    { player: initialPlayer },
    STEAM_POLL_INTERVAL_MS,
  );

  if (!player?.currentGame) return null;

  const { currentGame } = player;
  return (
    <a
      href={`https://store.steampowered.com/app/${currentGame.appId}/`}
      target="_blank"
      rel="noreferrer noopener"
      className="border-border hover:border-primary/40 group flex items-center gap-4 rounded-xl border p-4 transition-colors"
    >
      <Image
        src={currentGame.bannerUrl}
        alt={`${currentGame.name} cover`}
        width={184}
        height={69}
        unoptimized
        className="h-[34px] w-[92px] shrink-0 rounded-sm object-cover"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400/70" />
            <span className="relative inline-flex size-2 rounded-full bg-green-400" />
          </span>
          <span className="font-mono text-[10px] tracking-wider text-green-400 uppercase">
            in game
          </span>
        </div>
        <p className="text-foreground group-hover:text-primary mt-1 truncate text-base font-semibold transition-colors">
          {currentGame.name}
        </p>
      </div>
      <Gamepad2 size={16} className="text-muted-foreground shrink-0" aria-hidden />
    </a>
  );
}
