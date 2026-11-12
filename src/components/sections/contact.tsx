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
import { Tilt } from '@/components/ui/tilt';
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
    <section id="contact" className="scroll-mt-20 py-14" aria-labelledby="contact-heading">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
        <FadeIn className="lg:sticky lg:top-24 lg:self-start">
          <SectionHeading
            eyebrow="Contact"
            jp="連絡"
            title="Let's talk"
            titleId="contact-heading"
            description="Got a project in mind, looking to collaborate, or just want to say hi? Use whichever channel works best for you."
          />
          <a
            href={`mailto:${siteConfig.email}`}
            className="chamfer-sm bg-primary text-primary-foreground mt-8 inline-flex h-11 items-center gap-2 px-5 text-sm font-semibold shadow-[0_0_26px_-6px_var(--glow-strong)] transition-shadow hover:shadow-[0_0_34px_-2px_var(--glow-strong)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
          >
            <Mail size={15} aria-hidden />
            Say hello
            <ArrowUpRight size={15} aria-hidden />
          </a>
        </FadeIn>

        <ul className="grid gap-3 sm:grid-cols-2">
          {channels.map(({ label, value, href, icon: Icon, external }, idx) => {
            const className = 'hud-panel group flex items-center gap-3 p-4 outline-none';
            const inner = (
              <>
                <span className="bg-secondary text-primary group-hover:bg-primary group-hover:text-primary-foreground inline-flex h-10 w-10 shrink-0 items-center justify-center transition-colors">
                  <Icon size={18} />
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="text-muted-foreground font-mono text-[10px] tracking-[0.2em] uppercase">
                    {label}
                  </span>
                  <span className="text-foreground truncate text-sm font-medium">{value}</span>
                </span>
                <ArrowUpRight
                  size={16}
                  aria-hidden
                  className="text-muted-foreground/40 group-hover:text-primary ml-auto shrink-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </>
            );
            return (
              <li key={label}>
                <FadeIn delay={idx * 0.05}>
                  <Tilt max={3}>
                    {external ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className={className}
                      >
                        {inner}
                      </a>
                    ) : (
                      <Link href={href} className={className}>
                        {inner}
                      </Link>
                    )}
                  </Tilt>
                </FadeIn>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
