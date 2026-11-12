import { ArrowUp, Mail } from 'lucide-react';
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
    <footer className="mt-24 pb-10">
      <div
        aria-hidden
        className="h-px bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-60"
      />
      <div className="text-muted-foreground mt-8 flex flex-col items-center justify-between gap-5 text-xs sm:flex-row">
        <div className="flex flex-col items-center gap-1.5 sm:items-start">
          <p className="font-mono tracking-wider">
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
          <p
            className="text-muted-foreground inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.22em] uppercase"
            aria-hidden
          >
            <span className="bg-primary ping-dot relative size-1.5 rounded-full" />
            all systems nominal <span lang="ja">· 接続中</span>
          </p>
        </div>

        <ul className="flex items-center gap-0.5">
          {items.map(({ href, label, icon: Icon }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={label}
                className="hover:text-primary hover:bg-primary/10 inline-flex h-9 w-9 items-center justify-center transition-all hover:-translate-y-0.5 hover:shadow-[0_0_14px_-4px_var(--glow-strong)]"
              >
                <Icon size={16} />
              </a>
            </li>
          ))}
          <li className="ml-2">
            <a
              href="#top"
              aria-label="Back to top"
              className="border-border hover:border-primary hover:text-primary inline-flex h-9 w-9 items-center justify-center border transition-colors"
            >
              <ArrowUp size={15} aria-hidden />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
