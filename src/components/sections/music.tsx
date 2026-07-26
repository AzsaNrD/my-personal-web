import Image from 'next/image';
import { Suspense } from 'react';
import { Disc3, Music2 } from 'lucide-react';
import { getNowPlaying, getRecentTracks, getTopTracks } from '@/lib/integrations/lastfm';
import { NowPlayingCard } from '@/components/integrations/lastfm/now-playing-card';
import { RecentTracksList } from '@/components/integrations/lastfm/recent-tracks-list';
import { SectionHeading } from '@/components/layouts/page-header';

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
        className="border-border hover:border-primary/40 bg-card hover:bg-secondary/40 group flex items-center gap-3 rounded-xl border p-3 transition-colors"
      >
        {rank ? (
          <span className="text-muted-foreground w-5 shrink-0 text-right font-mono text-xs">
            {String(rank).padStart(2, '0')}
          </span>
        ) : null}
        {image ? (
          <Image
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
    <ul className="space-y-2">
      {tracks.map((t, i) => (
        <TrackRow
          key={`${t.name}-${t.artist}-${i}`}
          rank={i + 1}
          name={t.name}
          artist={t.artist}
          url={t.url}
          image={t.image}
          meta={`${t.playcount}×`}
        />
      ))}
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
            Live from{' '}
            <a
              href={`https://www.last.fm/user/${process.env.LASTFM_USERNAME ?? 'azsanrd'}`}
              target="_blank"
              rel="noreferrer noopener"
              className="hover:text-primary underline-offset-2 hover:underline"
            >
              Last.fm
            </a>
            , scrobbled from Spotify.
          </>
        }
      />

      <div>
        <h3 className="text-muted-foreground mb-3 font-mono text-[11px] tracking-wider uppercase">
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
          Top tracks · last 7 days
        </h3>
        <Suspense fallback={<Skeleton rows={5} />}>
          <TopTracks />
        </Suspense>
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 font-mono text-[11px] tracking-wider uppercase">
          Recent plays
        </h3>
        <Suspense fallback={<Skeleton rows={4} />}>
          <RecentTracksIsland />
        </Suspense>
      </div>
    </section>
  );
}
