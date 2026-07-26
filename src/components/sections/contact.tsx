import Link from 'next/link';
import { Mail, MessageCircle, ArrowUpRight } from 'lucide-react';
import {
  GithubIcon,
  LinkedinIcon,
  InstagramIcon,
  DiscordIcon,
  SpotifyIcon,
} from '@/components/ui/brand-icons';
import { FadeIn } from '@/components/ui/fade-in';
import { SectionHeading } from '@/components/layouts/page-header';
import { siteConfig } from '@/lib/site-config';

type Channel = {
  label: string;
  value: string;
  href: string;
  icon: React.ComponentType<{ size?: number }>;
  external?: boolean;
};

const channels: Channel[] = [
  {
    label: 'Email',
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
    icon: Mail,
    external: true,
  },
  { label: 'GitHub', value: '@AzsaNrD', href: '/github', icon: GithubIcon, external: true },
  { label: 'LinkedIn', value: 'in/azsa', href: '/linkedin', icon: LinkedinIcon, external: true },
  {
    label: 'Instagram',
    value: '@azsa_nrd',
    href: '/instagram',
    icon: InstagramIcon,
    external: true,
  },
  { label: 'Discord', value: 'Azsa NrD', href: '/discord', icon: DiscordIcon, external: true },
  {
    label: 'Spotify',
    value: "What I'm listening to",
    href: '/spotify',
    icon: SpotifyIcon,
    external: true,
  },
  { label: 'Guestbook', value: 'Leave a public message', href: '/guestbook', icon: MessageCircle },
];

export function Contact() {
  return (
    <section id="contact" className="py-10" aria-labelledby="contact-heading">
      <FadeIn>
        <SectionHeading
          eyebrow="Contact"
          jp="連絡"
          title="Let's talk"
          titleId="contact-heading"
          description="Got a project in mind, looking to collaborate, or just want to say hi? Use whichever channel works best for you."
        />
      </FadeIn>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {channels.map(({ label, value, href, icon: Icon, external }, idx) => {
          const className =
            'group border-border hover:border-primary/40 hover:bg-secondary/40 flex items-center gap-3 rounded-xl border p-4 transition-colors';
          const inner = (
            <>
              <span className="bg-secondary text-primary group-hover:bg-primary group-hover:text-primary-foreground inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors">
                <Icon size={18} />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="text-muted-foreground text-[11px] font-medium tracking-wider uppercase">
                  {label}
                </span>
                <span className="text-foreground truncate text-sm font-medium">{value}</span>
              </span>
              <ArrowUpRight
                size={16}
                aria-hidden
                className="text-muted-foreground/40 group-hover:text-primary ml-auto shrink-0 transition-colors"
              />
            </>
          );
          return (
            <FadeIn key={label} delay={idx * 0.05}>
              <li>
                {external ? (
                  <a href={href} target="_blank" rel="noreferrer noopener" className={className}>
                    {inner}
                  </a>
                ) : (
                  <Link href={href} className={className}>
                    {inner}
                  </Link>
                )}
              </li>
            </FadeIn>
          );
        })}
      </ul>
    </section>
  );
}
