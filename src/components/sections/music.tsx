import { Suspense } from 'react';
import { Crown, Disc3, Music2 } from 'lucide-react';
import { getNowPlaying, getRecentTracks, getTopTracks } from '@/lib/integrations/lastfm';
import { NowPlayingCard } from '@/components/integrations/lastfm/now-playing-card';
import { RecentTracksList } from '@/components/integrations/lastfm/recent-tracks-list';
import { LoadingImage } from '@/components/ui/loading-image';
import { SectionHeading } from '@/components/layouts/page-header';
import { cn } from '@/lib/utils';
import { lastfmThumb } from '@/lib/lastfm-image';

function TrackRow({
  rank,
  name,
  artist,
  url,
  image,
  meta,
}: {
  rank?: number;
  name: string;
  artist: string;
  url: string;
  image: string | null;
  meta?: string;
}) {
  return (
    <li>
      <a
        href={url}
        target="_blank"
        rel="noreferrer noopener"
        className="hud-panel group flex items-center gap-3 p-3 outline-none"
      >
        {rank ? (
          <span className="text-muted-foreground w-5 shrink-0 text-right font-mono text-xs">
            {String(rank).padStart(2, '0')}
          </span>
        ) : null}
        {image ? (
          <LoadingImage
            src={image}
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
            {name}
          </p>
          <p className="text-muted-foreground truncate text-xs">{artist}</p>
        </div>
        {meta ? (
          <span className="text-muted-foreground shrink-0 font-mono text-xs">{meta}</span>
        ) : null}
      </a>
    </li>
  );
}

async function NowPlayingIsland() {
  let track: Awaited<ReturnType<typeof getNowPlaying>> = null;
  try {
    track = await getNowPlaying();
  } catch (error) {
    console.error('[music/now-playing-island]', error);
  }
  return <NowPlayingCard initialTrack={track} />;
}

type TopTrack = Awaited<ReturnType<typeof getTopTracks>>[number];

function Cover({ image, className }: { image: string | null; className: string }) {
  if (image) {
    return (
      <LoadingImage
        src={lastfmThumb(image, '174s')}
        alt=""
        width={72}
        height={72}
        unoptimized
        className={cn('shrink-0 rounded-sm object-cover', className)}
      />
    );
  }
  return (
    <span
      className={cn(
        'bg-muted text-muted-foreground/60 inline-flex shrink-0 items-center justify-center rounded-sm',
        className,
      )}
    >
      <Disc3 size={20} aria-hidden />
    </span>
  );
}

/** #1: the featured card, with a bracketed frame and a large gradient rank. */
function TopTrackFirst({ track }: { track: TopTrack }) {
  return (
    <li>
      <a
        href={track.url}
        target="_blank"
        rel="noreferrer noopener"
        className="hud-panel hud-corners from-primary/10 group flex items-center gap-4 bg-gradient-to-br to-transparent p-4 shadow-[0_0_30px_-12px_var(--glow-strong)] outline-none"
      >
        <Cover
          image={track.image}
          className="size-[72px] shadow-[0_0_22px_-6px_var(--glow-strong)]"
        />
        <div className="min-w-0 flex-1">
          <p className="text-primary inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] uppercase">
            <Crown size={12} aria-hidden />
            Most played
          </p>
          <p className="text-foreground group-hover:text-primary mt-1 truncate text-base font-semibold transition-colors">
            {track.name}
          </p>
          <p className="text-muted-foreground truncate text-sm">{track.artist}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-display text-gradient text-3xl leading-none font-bold">01</p>
          <p className="text-muted-foreground mt-1.5 font-mono text-xs">{track.playcount}× plays</p>
        </div>
      </a>
    </li>
  );
}

/** #2 and #3: mid-size rows with a coloured edge and rank. */
function TopTrackPodium({ track, rank }: { track: TopTrack; rank: 2 | 3 }) {
  const accent = rank === 2 ? 'var(--cyan)' : 'var(--magenta)';
  return (
    <li>
      <a
        href={track.url}
        target="_blank"
        rel="noreferrer noopener"
        style={{ ['--accent' as string]: accent }}
        className="hud-panel group flex items-center gap-3.5 py-3.5 pr-3.5 pl-4 outline-none"
      >
        <span aria-hidden className="absolute inset-y-0 left-0 w-0.5 bg-[var(--accent)]" />
        <span className="font-display w-7 shrink-0 text-xl font-bold text-[var(--accent)]">
          {String(rank).padStart(2, '0')}
        </span>
        <Cover image={track.image} className="size-12" />
        <div className="min-w-0 flex-1">
          <p className="text-foreground group-hover:text-primary truncate text-sm font-medium transition-colors">
            {track.name}
          </p>
          <p className="text-muted-foreground truncate text-xs">{track.artist}</p>
        </div>
        <span className="text-muted-foreground shrink-0 font-mono text-xs">{track.playcount}×</span>
      </a>
    </li>
  );
}

async function TopTracks() {
  let tracks: Awaited<ReturnType<typeof getTopTracks>> = [];
  try {
    tracks = await getTopTracks('7day', 5);
  } catch (error) {
    console.error('[music/top-tracks]', error);
  }
  if (!tracks.length) {
    return <p className="text-muted-foreground text-sm">No top tracks yet.</p>;
  }
  return (
    <ul className="space-y-2.5">
      {tracks.map((t, i) => {
        const key = `${t.name}-${t.artist}-${i}`;
        if (i === 0) return <TopTrackFirst key={key} track={t} />;
        if (i < 3) return <TopTrackPodium key={key} track={t} rank={(i + 1) as 2 | 3} />;
        return (
          <TrackRow
            key={key}
            rank={i + 1}
            name={t.name}
            artist={t.artist}
            url={t.url}
            image={t.image}
            meta={`${t.playcount}×`}
          />
        );
      })}
    </ul>
  );
}

async function RecentTracksIsland() {
  let tracks: Awaited<ReturnType<typeof getRecentTracks>> = [];
  try {
    tracks = await getRecentTracks(4);
  } catch (error) {
    console.error('[music/recent-tracks-island]', error);
  }
  return <RecentTracksList initialTracks={tracks} limit={4} />;
}

function Skeleton({ rows }: { rows: number }) {
  return (
    <ul className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <li
          key={i}
          className="border-border bg-muted/40 h-14 animate-pulse rounded-xl border"
          aria-hidden
        />
      ))}
    </ul>
  );
}

export function Music() {
  return (
    <section className="space-y-8">
      <SectionHeading
        eyebrow="Music"
        jp="音楽"
        title="What I'm listening to"
        icon={Music2}
        description={
          <>
            My{' '}
            <a
              href={`https://www.last.fm/user/${process.env.LASTFM_USERNAME ?? 'azsanrd'}`}
              target="_blank"
              rel="noreferrer noopener"
              className="hover:text-primary underline-offset-2 hover:underline"
            >
              listening history
            </a>
            , updated live.
          </>
        }
      />

      <div>
        <h3 className="text-muted-foreground mb-3 font-mono text-[11px] tracking-wider uppercase">
          <span className="text-primary/60" aria-hidden>
            //{' '}
          </span>
          Now / last played
        </h3>
        <Suspense
          fallback={
            <div className="border-border bg-muted/40 h-24 animate-pulse rounded-xl border" />
          }
        >
          <NowPlayingIsland />
        </Suspense>
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 font-mono text-[11px] tracking-wider uppercase">
          <span className="text-primary/60" aria-hidden>
            //{' '}
          </span>
          Top tracks · last 7 days
        </h3>
        <Suspense fallback={<Skeleton rows={5} />}>
          <TopTracks />
        </Suspense>
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 font-mono text-[11px] tracking-wider uppercase">
          <span className="text-primary/60" aria-hidden>
            //{' '}
          </span>
          Recent plays
        </h3>
        <Suspense fallback={<Skeleton rows={4} />}>
          <RecentTracksIsland />
        </Suspense>
      </div>
    </section>
  );
}
