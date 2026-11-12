import Link from 'next/link';
import { Mail, ArrowUpRight } from 'lucide-react';
import { GithubIcon, LinkedinIcon, InstagramIcon, DiscordIcon } from '@/components/ui/brand-icons';
import { CopyText } from '@/components/ui/copy-text';
import { FadeIn } from '@/components/ui/fade-in';
import { SectionHeading } from '@/components/layouts/page-header';
import { siteConfig } from '@/lib/site-config';

const socials: {
  label: string;
  handle: string;
  href: string;
  icon: React.ComponentType<{ size?: number }>;
}[] = [
  { label: 'GitHub', handle: '@AzsaNrD', href: '/github', icon: GithubIcon },
  { label: 'LinkedIn', handle: 'in/azsa', href: '/linkedin', icon: LinkedinIcon },
  { label: 'Instagram', handle: '@azsa_nrd', href: '/instagram', icon: InstagramIcon },
  { label: 'Discord', handle: 'Azsa NrD', href: '/discord', icon: DiscordIcon },
];

const eyebrowClass = 'text-muted-foreground font-mono text-[10px] tracking-[0.2em] uppercase';

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
            description="Got a project in mind, looking to collaborate, or just want to say hi? Email is the fastest way to reach me."
          />
        </FadeIn>

        <FadeIn delay={0.08}>
          <div className="hud-panel hud-corners divide-border divide-y">
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className={eyebrowClass}>Email</p>
                <p className="mt-1.5 flex items-center gap-2">
                  <span className="text-foreground truncate font-mono text-sm sm:text-base">
                    {siteConfig.email}
                  </span>
                  <CopyText value={siteConfig.email} label="email address" />
                </p>
              </div>
              <a
                href={`mailto:${siteConfig.email}`}
                className="chamfer-sm bg-primary text-primary-foreground inline-flex h-11 shrink-0 items-center justify-center gap-2 px-5 text-sm font-semibold shadow-[0_0_26px_-6px_var(--glow-strong)] transition-shadow hover:shadow-[0_0_34px_-2px_var(--glow-strong)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
              >
                <Mail size={15} aria-hidden />
                Say hello
              </a>
            </div>

            <div className="p-5">
              <p className={eyebrowClass}>Elsewhere</p>
              <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {socials.map(({ label, handle, href, icon: Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer noopener"
                      title={`${label} · ${handle}`}
                      className="border-border bg-secondary/50 hover:border-primary/60 hover:bg-primary/10 hover:text-primary group flex h-11 items-center justify-center gap-2 border px-3 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_18px_-6px_var(--glow-strong)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
                    >
                      <Icon size={16} />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/guestbook"
              className="hover:bg-primary/5 group focus-visible:bg-primary/5 flex items-center justify-between gap-3 px-5 py-4 text-sm transition-colors outline-none"
            >
              <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                Prefer something public? Sign the guestbook.
              </span>
              <ArrowUpRight
                size={16}
                aria-hidden
                className="text-muted-foreground/60 group-hover:text-primary shrink-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
