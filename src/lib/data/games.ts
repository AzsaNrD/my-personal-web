export type Game = {
  slug: string;
  name: string;
  icon: string;
  identity: string;
  identityLabel?: string;
  copyable?: boolean;
  url: string;
  meta?: string;
};

export const games: Game[] = [
  {
    slug: 'genshin',
    name: 'Genshin Impact',
    icon: '/icons/genshin.webp',
    identity: '817588829',
    identityLabel: 'UID',
    copyable: true,
    url: 'https://enka.network/u/817588829/',
    meta: 'AR 60 · Asia',
  },
  {
    slug: 'valorant',
    name: 'Valorant',
    icon: '/icons/valorant.svg',
    identity: 'OrionZen#Void',
    copyable: true,
    url: 'https://tracker.gg/valorant/profile/riot/OrionZen%23Void/overview',
  },
  {
    slug: 'roblox',
    name: 'Roblox',
    icon: '/icons/roblox.svg',
    identity: '4228557157',
    url: 'https://www.roblox.com/users/4228557157/profile',
  },
];
