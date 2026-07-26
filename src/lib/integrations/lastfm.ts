const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

export type LastfmTrack = {
  name: string;
  artist: string;
  album: string;
  url: string;
  image: string | null;
  nowPlaying: boolean;
  playedAt: Date | null;
};

export type LastfmTopTrack = LastfmTrack & {
  playcount: number;
};

export type LastfmPeriod = '7day' | '1month' | '3month' | '6month' | '12month' | 'overall';

type ImageEntry = { '#text': string; size: string };
type RawTrack = {
  name: string;
  artist: { '#text': string } | { name: string } | string;
  album?: { '#text': string };
  url: string;
  image?: ImageEntry[];
  '@attr'?: { nowplaying?: string };
  date?: { uts: string };
  playcount?: string;
};

function pickImage(images: ImageEntry[] | undefined): string | null {
  if (!images?.length) return null;
  const large = images.find((i) => i.size === 'large')?.['#text'];
  const xlarge = images.find((i) => i.size === 'extralarge')?.['#text'];
  const url = xlarge || large || images[images.length - 1]?.['#text'];
  if (!url) return null;
  if (url.includes('2a96cbd8b46e442fc41c2b86b821562f')) return null;
  return url;
}

function getArtist(artist: RawTrack['artist']): string {
  if (typeof artist === 'string') return artist;
  if ('#text' in artist) return artist['#text'];
  if ('name' in artist) return artist.name;
  return '';
}

function normalize(raw: RawTrack): LastfmTrack {
  return {
    name: raw.name,
    artist: getArtist(raw.artist),
    album: raw.album?.['#text'] ?? '',
    url: raw.url,
    image: pickImage(raw.image),
    nowPlaying: raw['@attr']?.nowplaying === 'true',
    playedAt: raw.date?.uts ? new Date(Number(raw.date.uts) * 1000) : null,
  };
}

function buildUrl(method: string, params: Record<string, string> = {}) {
  const apiKey = process.env.LASTFM_API_KEY;
  const user = process.env.LASTFM_USERNAME;
  if (!apiKey || !user) {
    throw new Error('LASTFM_API_KEY or LASTFM_USERNAME not set');
  }
  const url = new URL(BASE_URL);
  url.searchParams.set('method', method);
  url.searchParams.set('user', user);
  url.searchParams.set('api_key', apiKey);
  url.searchParams.set('format', 'json');
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  return url.toString();
}

async function lastfmFetch<T>(url: string, revalidate: number): Promise<T> {
  const res = await fetch(url, { next: { revalidate } });
  if (!res.ok) throw new Error(`Last.fm ${res.status}: ${await res.text()}`);
  return (await res.json()) as T;
}

export async function getRecentTracks(limit = 10): Promise<LastfmTrack[]> {
  const url = buildUrl('user.getrecenttracks', { limit: String(limit) });
  const data = await lastfmFetch<{ recenttracks: { track: RawTrack[] | RawTrack } }>(url, 30);
  const tracks = data.recenttracks?.track ?? [];
  const arr = Array.isArray(tracks) ? tracks : [tracks];
  return arr.map(normalize);
}

export async function getNowPlaying(): Promise<LastfmTrack | null> {
  const tracks = await getRecentTracks(1);
  return tracks[0] ?? null;
}

async function getTrackImage(artist: string, track: string): Promise<string | null> {
  const apiKey = process.env.LASTFM_API_KEY;
  if (!apiKey) return null;
  const url = new URL(BASE_URL);
  url.searchParams.set('method', 'track.getInfo');
  url.searchParams.set('artist', artist);
  url.searchParams.set('track', track);
  url.searchParams.set('api_key', apiKey);
  url.searchParams.set('format', 'json');
  try {
    const data = await lastfmFetch<{ track?: { album?: { image?: ImageEntry[] } } }>(
      url.toString(),
      3600,
    );
    return pickImage(data.track?.album?.image);
  } catch {
    return null;
  }
}

export async function getTopTracks(
  period: LastfmPeriod = '7day',
  limit = 10,
): Promise<LastfmTopTrack[]> {
  const url = buildUrl('user.gettoptracks', { period, limit: String(limit) });
  const data = await lastfmFetch<{ toptracks: { track: RawTrack[] | RawTrack } }>(url, 1800);
  const tracks = data.toptracks?.track ?? [];
  const arr = Array.isArray(tracks) ? tracks : [tracks];
  const base = arr.map((t) => ({ ...normalize(t), playcount: Number(t.playcount ?? 0) }));
  const enriched = await Promise.all(
    base.map(async (t) => {
      if (t.image) return t;
      const image = await getTrackImage(t.artist, t.name);
      return { ...t, image };
    }),
  );
  return enriched;
}
