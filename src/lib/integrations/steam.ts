const BASE_URL = 'https://api.steampowered.com';
const STORE_CDN = 'https://cdn.cloudflare.steamstatic.com/steam/apps';
const ICON_CDN = 'https://media.steampowered.com/steamcommunity/public/images/apps';

// App IDs to never surface (e.g. Valve's Spacewar test app).
const HIDDEN_APP_IDS = new Set([480]);

export type SteamPlayer = {
  name: string;
  avatar: string;
  profileUrl: string;
  state: 'offline' | 'online' | 'busy' | 'away' | 'snooze' | 'looking-to-trade' | 'looking-to-play';
  currentGame: { appId: number; name: string; bannerUrl: string } | null;
};

export type SteamGame = {
  appId: number;
  name: string;
  bannerUrl: string;
  capsuleUrl: string;
  iconUrl: string | null;
  playtimeMinutes: number;
  playtime2WeeksMinutes: number;
};

export type SteamSummary = {
  totalGames: number;
};

const PERSONA_STATES: SteamPlayer['state'][] = [
  'offline',
  'online',
  'busy',
  'away',
  'snooze',
  'looking-to-trade',
  'looking-to-play',
];

function bannerUrl(appId: number) {
  return `${STORE_CDN}/${appId}/header.jpg`;
}

function capsuleUrl(appId: number) {
  return `${STORE_CDN}/${appId}/capsule_184x69.jpg`;
}

function iconUrl(appId: number, hash: string | undefined) {
  if (!hash) return null;
  return `${ICON_CDN}/${appId}/${hash}.jpg`;
}

function requireEnv() {
  const apiKey = process.env.STEAM_API_KEY;
  const steamId = process.env.STEAM_ID;
  if (!apiKey || !steamId) {
    throw new Error('STEAM_API_KEY or STEAM_ID not set');
  }
  return { apiKey, steamId };
}

async function steamFetch<T>(url: string, revalidate: number): Promise<T> {
  const res = await fetch(url, { next: { revalidate } });
  if (!res.ok) throw new Error(`Steam ${res.status}: ${await res.text()}`);
  return (await res.json()) as T;
}

type AppDetailsResponse = Record<
  string,
  {
    success: boolean;
    data?: {
      header_image?: string;
      capsule_image?: string;
      capsule_imagev5?: string;
    };
  }
>;

async function getAppDetailsImages(
  appId: number,
): Promise<{ header: string | null; capsule: string | null }> {
  const url = `https://store.steampowered.com/api/appdetails?appids=${appId}&filters=basic`;
  try {
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return { header: null, capsule: null };
    const data = (await res.json()) as AppDetailsResponse;
    const entry = data[String(appId)];
    if (!entry?.success) return { header: null, capsule: null };
    return {
      header: entry.data?.header_image ?? null,
      capsule: entry.data?.capsule_imagev5 ?? entry.data?.capsule_image ?? null,
    };
  } catch {
    return { header: null, capsule: null };
  }
}

type RawPlayerSummary = {
  steamid: string;
  personaname: string;
  profileurl: string;
  avatarfull: string;
  personastate: number;
  gameid?: string;
  gameextrainfo?: string;
};

export async function getSteamPlayer(): Promise<SteamPlayer | null> {
  const { apiKey, steamId } = requireEnv();
  const url = `${BASE_URL}/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey}&steamids=${steamId}`;
  try {
    const data = await steamFetch<{ response: { players: RawPlayerSummary[] } }>(url, 60);
    const player = data.response?.players?.[0];
    if (!player) return null;
    const state = PERSONA_STATES[player.personastate] ?? 'offline';
    const gameId = player.gameid ? Number(player.gameid) : null;
    let currentGame: SteamPlayer['currentGame'] = null;
    if (gameId && player.gameextrainfo && !HIDDEN_APP_IDS.has(gameId)) {
      const images = await getAppDetailsImages(gameId);
      currentGame = {
        appId: gameId,
        name: player.gameextrainfo,
        bannerUrl: images.header ?? bannerUrl(gameId),
      };
    }
    return {
      name: player.personaname,
      avatar: player.avatarfull,
      profileUrl: player.profileurl,
      state,
      currentGame,
    };
  } catch {
    return null;
  }
}

type RawRecentGame = {
  appid: number;
  name: string;
  playtime_2weeks: number;
  playtime_forever: number;
  img_icon_url?: string;
};

export async function getRecentSteamGames(limit = 5): Promise<SteamGame[]> {
  const { apiKey, steamId } = requireEnv();
  const url = `${BASE_URL}/IPlayerService/GetRecentlyPlayedGames/v1/?key=${apiKey}&steamid=${steamId}&count=${limit}`;
  try {
    const data = await steamFetch<{ response: { games?: RawRecentGame[] } }>(url, 600);
    const games = (data.response?.games ?? []).filter((g) => !HIDDEN_APP_IDS.has(g.appid));
    return await Promise.all(
      games.map(async (g) => {
        const images = await getAppDetailsImages(g.appid);
        return {
          appId: g.appid,
          name: g.name,
          bannerUrl: images.header ?? bannerUrl(g.appid),
          capsuleUrl: images.capsule ?? capsuleUrl(g.appid),
          iconUrl: iconUrl(g.appid, g.img_icon_url),
          playtimeMinutes: g.playtime_forever,
          playtime2WeeksMinutes: g.playtime_2weeks,
        };
      }),
    );
  } catch {
    return [];
  }
}

export async function getSteamSummary(): Promise<SteamSummary | null> {
  const { apiKey, steamId } = requireEnv();
  const url = `${BASE_URL}/IPlayerService/GetOwnedGames/v1/?key=${apiKey}&steamid=${steamId}&include_played_free_games=true&format=json`;
  try {
    const data = await steamFetch<{ response: { game_count?: number } }>(url, 3600);
    return { totalGames: data.response?.game_count ?? 0 };
  } catch {
    return null;
  }
}

export function formatPlaytime(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = minutes / 60;
  if (hours < 10) return `${hours.toFixed(1)}h`;
  return `${Math.round(hours)}h`;
}

export function steamStoreUrl(appId: number): string {
  return `https://store.steampowered.com/app/${appId}/`;
}
