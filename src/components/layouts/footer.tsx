import { Mail } from 'lucide-react';
import {
  GithubIcon,
  LinkedinIcon,
  InstagramIcon,
  DiscordIcon,
  SpotifyIcon,
} from '@/components/ui/brand-icons';
import { siteConfig } from '@/lib/site-config';

const items = [
  { href: '/github', label: 'GitHub', icon: GithubIcon },
  { href: '/linkedin', label: 'LinkedIn', icon: LinkedinIcon },
  { href: '/instagram', label: 'Instagram', icon: InstagramIcon },
  { href: '/discord', label: 'Discord', icon: DiscordIcon },
  { href: '/spotify', label: 'Spotify', icon: SpotifyIcon },
  { href: `mailto:${siteConfig.email}`, label: 'Email', icon: Mail },
];

export function Footer() {
  return (
    <footer className="border-border mt-20 border-t pt-8 pb-10">
      <div className="text-muted-foreground flex flex-col items-center justify-between gap-4 text-xs sm:flex-row">
        <p className="font-mono">
          &copy; {new Date().getFullYear()}{' '}
          <a
            href="/github"
            target="_blank"
            rel="noreferrer noopener"
            className="hover:text-primary transition-colors"
          >
            {siteConfig.name}
          </a>
        </p>
        <ul className="flex items-center gap-0.5">
          {items.map(({ href, label, icon: Icon }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={label}
                className="hover:text-primary hover:bg-secondary inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors"
              >
                <Icon size={16} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
