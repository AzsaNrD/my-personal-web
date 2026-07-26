export const siteConfig = {
  name: 'Azsa Nurwahyudi',
  shortName: 'azsa-nrd',
  role: 'Web Developer',
  bio: 'I build for the web and learn something new with every project.',
  location: 'Indonesia',
  email: 'azsa.dev@gmail.com',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  ownerIds: ['github:85381324', 'discord:538126686231986176', 'google:114750223834640505306'],
  links: {
    github: 'https://github.com/AzsaNrD',
    linkedin: 'https://www.linkedin.com/in/azsa/',
    instagram: 'https://www.instagram.com/azsa_nrd/',
    discord: 'https://discord.com/users/538126686231986176',
    spotify: 'https://open.spotify.com/user/iro95muv6ek5ze2yltiscntwg',
  },
  nav: [
    { href: '/', label: 'Home' },
    { href: '/blog', label: 'Blog' },
    { href: '/misc', label: 'Misc' },
    { href: '/guestbook', label: 'Guestbook' },
  ],
};

export type SiteConfig = typeof siteConfig;
