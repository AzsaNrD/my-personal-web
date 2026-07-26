import { Suspense } from 'react';
import { ArrowUpRight, Gamepad2 } from 'lucide-react';
import {
  formatPlaytime,
  getRecentSteamGames,
  getSteamPlayer,
  getSteamSummary,
  steamStoreUrl,
  type SteamGame,
  type SteamPlayer,
  type SteamSummary,
} from '@/lib/integrations/steam';
import { SteamGameImage } from '@/components/integrations/steam/steam-game-image';
import { SteamNowPlaying } from '@/components/integrations/steam/steam-now-playing';
import { SteamAvatar } from '@/components/integrations/steam/steam-avatar';

async function loadAll(): Promise<{
  player: SteamPlayer | null;
  summary: SteamSummary | null;
  recent: SteamGame[];
}> {
  const [player, summary, recent] = await Promise.all([
    getSteamPlayer().catch((error) => {
      console.error('[steam/player]', error);
      return null;
    }),
    getSteamSummary().catch((error) => {
      console.error('[steam/summary]', error);
      return null;
    }),
    getRecentSteamGames(5).catch((error) => {
      console.error('[steam/recent]', error);
      return [] as SteamGame[];
    }),
  ]);
  return { player, summary, recent };
}

function totalPlaytime2W(games: SteamGame[]): number {
  return games.reduce((acc, g) => acc + g.playtime2WeeksMinutes, 0);
}

const STATUS_STYLES: Record<
  SteamPlayer['state'],
  { label: string; dot: string; text: string; ring?: boolean }
> = {
  online: { label: 'Online', dot: 'bg-green-400', text: 'text-green-400', ring: true },
  away: { label: 'Away', dot: 'bg-amber-400', text: 'text-amber-400' },
  snooze: { label: 'Snooze', dot: 'bg-violet-400', text: 'text-violet-400' },
  busy: { label: 'Busy', dot: 'bg-red-400', text: 'text-red-400' },
  'looking-to-trade': { label: 'Looking to trade', dot: 'bg-blue-400', text: 'text-blue-400' },
  'looking-to-play': { label: 'Looking to play', dot: 'bg-cyan-400', text: 'text-cyan-400' },
  offline: { label: 'Offline', dot: 'bg-muted-foreground/40', text: 'text-muted-foreground' },
};

function StatusBadge({ state }: { state: SteamPlayer['state'] }) {
  const style = STATUS_STYLES[state];
  return (
    <span className={`inline-flex items-center gap-1.5 ${style.text}`}>
      <span className="relative flex size-2 shrink-0">
        {style.ring ? (
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full ${style.dot} opacity-70`}
          />
        ) : null}
        <span className={`relative inline-flex size-2 rounded-full ${style.dot}`} />
      </span>
      <span className="font-medium">{style.label}</span>
    </span>
  );
}

function RecentGamesList({ games }: { games: SteamGame[] }) {
  if (!games.length) {
    return (
      <p className="text-muted-foreground border-border rounded-xl border border-dashed p-4 text-sm">
        No recent activity in the last 2 weeks.
      </p>
    );
  }
  return (
    <ul className="space-y-2">
      {games.map((g) => (
        <li key={g.appId}>
          <a
            href={steamStoreUrl(g.appId)}
            target="_blank"
            rel="noreferrer noopener"
            className="border-border hover:border-primary/40 hover:bg-secondary/40 group flex items-center gap-3 rounded-xl border p-3 transition-colors"
          >
            <SteamGameImage
              banner={g.bannerUrl}
              capsule={g.capsuleUrl}
              icon={g.iconUrl}
              name={g.name}
              width={184}
              height={69}
              className="h-[34px] w-[92px] shrink-0 rounded-sm object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="text-foreground group-hover:text-primary truncate text-sm font-medium transition-colors">
                {g.name}
              </p>
              <p className="text-muted-foreground truncate text-xs">
                {formatPlaytime(g.playtime2WeeksMinutes)} · last 2 weeks
              </p>
            </div>
            <span className="text-muted-foreground shrink-0 font-mono text-xs">
              {formatPlaytime(g.playtimeMinutes)} total
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

function HeroCard({
  player,
  summary,
  recent,
}: {
  player: SteamPlayer;
  summary: SteamSummary | null;
  recent: SteamGame[];
}) {
  const playtime2W = totalPlaytime2W(recent);
  return (
    <div className="border-border from-primary/5 to-card relative overflow-hidden rounded-xl border bg-gradient-to-br">
      <a
        href={player.profileUrl}
        target="_blank"
        rel="noreferrer noopener"
        className="hover:bg-muted/30 group flex items-center gap-4 p-5 transition-colors"
      >
        <SteamAvatar
          src={player.avatar}
          alt={player.name}
          size={80}
          className="ring-border ring-offset-card size-20 shrink-0 rounded-lg object-cover ring-2 ring-offset-2"
        />
        <div className="min-w-0 flex-1">
          <p className="text-muted-foreground font-mono text-[10px] tracking-wider uppercase">
            Steam profile
          </p>
          <p className="text-foreground group-hover:text-primary mt-0.5 truncate text-xl font-semibold transition-colors">
            {player.name}
          </p>
          <p className="mt-1 inline-flex items-center gap-2 text-xs">
            {player.currentGame ? (
              <span className="inline-flex items-center gap-1.5 text-green-400">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400/70" />
                  <span className="relative inline-flex size-2 rounded-full bg-green-400" />
                </span>
                <span className="font-medium">Playing {player.currentGame.name}</span>
              </span>
            ) : (
              <StatusBadge state={player.state} />
            )}
          </p>
        </div>
        <ArrowUpRight size={18} className="text-muted-foreground shrink-0" aria-hidden />
      </a>
      <dl className="border-border divide-border grid grid-cols-3 divide-x border-t">
        <div className="px-4 py-3 text-center">
          <dd className="text-foreground font-mono text-xl font-semibold">
            {summary?.totalGames ?? '—'}
          </dd>
          <dt className="text-muted-foreground mt-0.5 font-mono text-[10px] tracking-wider uppercase">
            Games owned
          </dt>
        </div>
        <div className="px-4 py-3 text-center">
          <dd className="text-foreground font-mono text-xl font-semibold">
            {playtime2W ? formatPlaytime(playtime2W) : '—'}
          </dd>
          <dt className="text-muted-foreground mt-0.5 font-mono text-[10px] tracking-wider uppercase">
            Last 2 weeks
          </dt>
        </div>
        <div className="px-4 py-3 text-center">
          <dd className="text-foreground font-mono text-xl font-semibold">{recent.length}</dd>
          <dt className="text-muted-foreground mt-0.5 font-mono text-[10px] tracking-wider uppercase">
            Recent games
          </dt>
        </div>
      </dl>
    </div>
  );
}

async function SteamSection() {
  const { player, summary, recent } = await loadAll();
  if (!player) {
    return (
      <p className="text-muted-foreground border-border rounded-xl border border-dashed p-4 text-sm">
        Steam profile not available.
      </p>
    );
  }
  return (
    <div className="space-y-4">
      <HeroCard player={player} summary={summary} recent={recent} />
      <SteamNowPlaying initialPlayer={player} />
      <div>
        <h3 className="text-muted-foreground mb-3 font-mono text-xs tracking-wider uppercase">
          Recently played
        </h3>
        <RecentGamesList games={recent} />
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-3">
      <div className="border-border bg-muted/40 h-20 animate-pulse rounded-xl border" />
      <ul className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <li
            key={i}
            className="border-border bg-muted/40 h-14 animate-pulse rounded-lg border"
            aria-hidden
          />
        ))}
      </ul>
    </div>
  );
}

export function SteamActivity() {
  return (
    <div>
      <h3 className="text-muted-foreground mb-3 flex items-center gap-2 font-mono text-xs tracking-wider uppercase">
        <Gamepad2 size={12} aria-hidden />
        Steam activity
      </h3>
      <Suspense fallback={<Skeleton />}>
        <SteamSection />
      </Suspense>
    </div>
  );
}
