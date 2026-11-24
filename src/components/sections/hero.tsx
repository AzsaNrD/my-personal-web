import Link from 'next/link';
import { ArrowRight, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Marquee } from '@/components/ui/marquee';
import { Tilt } from '@/components/ui/tilt';
import { Typewriter } from '@/components/ui/typewriter';
import { NowPlaying } from '@/components/integrations/lastfm/now-playing';
import { HeroName } from '@/components/sections/hero-name';
import { experience } from '@/lib/data/experience';
import { projects } from '@/lib/data/projects';
import { skills } from '@/lib/data/skills';
import { getPublicRepoCount } from '@/lib/integrations/github';
import { siteConfig } from '@/lib/site-config';

const ROLES = [
  siteConfig.role,
  'Anime. Games. EDM.',
  'Wondering where AI takes us',
  'What will the future be?',
];

const current = experience.find((item) => item.current);

/** "Badan Siber dan Sandi Negara (BSSN)" becomes "BSSN"; names without an acronym stay whole. */
const shortOrg = (org: string) => /\(([^)]+)\)/.exec(org)?.[1] ?? org;

const githubLabel = siteConfig.links.github.replace(/^https?:\/\//, '');

function TerminalLine({
  cmd,
  out,
  className,
}: {
  cmd: string;
  out: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <p>
        <span className="text-primary">$</span> <span className="text-foreground">{cmd}</span>
      </p>
      <p className="text-muted-foreground pl-3">{out}</p>
    </div>
  );
}

export async function Hero() {
  const repos = await getPublicRepoCount();
  const stats = [
    { label: 'Projects', value: projects.length },
    ...(repos !== null ? [{ label: 'Repos', value: repos }] : []),
    { label: 'Experience', value: experience.length },
  ];

  return (
    <section className="relative pt-10 pb-6 md:pt-16" aria-label="Introduction">
      <div
        aria-hidden
        className="grid-bg pointer-events-none absolute -top-4 left-1/2 -z-10 h-[35rem] w-screen -translate-x-1/2"
      />

      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10 [&>*]:min-w-0">
        <div className="animate-[rise-up_0.7s_ease-out_both]">
          <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.22em] uppercase">
            <span className="text-primary/60" aria-hidden>
              //
            </span>
            <span className="text-primary">{siteConfig.role}</span>
            <span className="text-muted-foreground/50">/</span>
            <span lang="ja" className="text-muted-foreground">
              インドネシア
            </span>
          </div>

          <h1 className="font-display mt-5 text-5xl leading-[1.05] font-bold tracking-tight sm:text-6xl lg:text-7xl">
            <span className="text-foreground block">Hi, I&apos;m</span>
            <HeroName name={siteConfig.name} />
          </h1>

          <p className="mt-5 min-h-5 font-mono text-sm sm:min-h-6 sm:text-base">
            <span className="text-primary/70" aria-hidden>
              &gt;{' '}
            </span>
            <Typewriter phrases={ROLES} className="text-foreground" />
          </p>

          <p className="text-muted-foreground mt-5 max-w-prose text-base leading-relaxed">
            {siteConfig.bio}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              size="default"
              className="chamfer-sm h-11 gap-2 rounded-none px-5 text-sm font-semibold shadow-[0_0_26px_-6px_var(--glow-strong)] transition-shadow hover:shadow-[0_0_34px_-2px_var(--glow-strong)]"
              nativeButton={false}
              render={<Link href="#portfolio" />}
            >
              See my work
              <ArrowRight size={15} aria-hidden />
            </Button>
            <Button
              size="default"
              variant="ghost"
              className="chamfer-outline hover:text-primary h-11 gap-2 rounded-none px-5 text-sm hover:bg-transparent dark:hover:bg-transparent"
              nativeButton={false}
              render={<Link href="#contact" />}
            >
              <Mail size={15} aria-hidden />
              Get in touch
            </Button>
          </div>

          <NowPlaying />
        </div>

        <div className="animate-[rise-in_0.8s_0.15s_ease-out_both]">
          <Tilt max={4}>
            <div className="hud-panel hud-corners cursor-default overflow-hidden">
              <div className="border-border flex items-center gap-2 border-b px-4 py-2.5">
                <span className="size-2.5 rounded-full bg-[var(--magenta)]/80" aria-hidden />
                <span className="size-2.5 rounded-full bg-[var(--cyan)]/80" aria-hidden />
                <span className="bg-primary/80 size-2.5 rounded-full" aria-hidden />
                <span className="text-muted-foreground ml-2 font-mono text-xs tracking-wider">
                  profile.log
                </span>
                <span
                  className="text-muted-foreground/60 ml-auto font-mono text-[11px] tracking-[0.2em] uppercase"
                  aria-hidden
                >
                  read-only
                </span>
              </div>

              <div className="space-y-3.5 p-4 font-mono text-[13px] leading-relaxed sm:p-5">
                {/* Location and the stat row are dropped on phones: the card stays three lines and the page shorter. */}
                <TerminalLine
                  cmd="cat location.txt"
                  out={siteConfig.location}
                  className="max-sm:hidden"
                />
                {current ? (
                  <TerminalLine
                    cmd="status --now"
                    out={
                      <>
                        <span className="text-primary">●</span> {current.role} @{' '}
                        {shortOrg(current.org)}
                      </>
                    }
                  />
                ) : null}
                <TerminalLine cmd="cat now.txt" out={siteConfig.now} />
                <TerminalLine
                  cmd="open github"
                  out={
                    <a
                      href="/github"
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-primary -my-2 inline-block cursor-pointer py-2 underline-offset-4 hover:underline"
                    >
                      {githubLabel} ↗
                    </a>
                  }
                />
              </div>

              <dl
                className={`border-border grid border-t max-sm:hidden ${stats.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}
              >
                {stats.map(({ label, value }) => (
                  <div key={label} className="border-border px-4 py-3 not-first:border-l">
                    <dd className="font-display text-gradient text-2xl font-bold tabular-nums">
                      {String(value).padStart(2, '0')}
                    </dd>
                    <dt className="text-muted-foreground font-mono text-[11px] tracking-[0.2em] uppercase">
                      {label}
                    </dt>
                  </div>
                ))}
              </dl>
            </div>
          </Tilt>
        </div>
      </div>

      <div className="border-border mt-14 border-y py-3.5">
        <Marquee items={skills} />
      </div>
    </section>
  );
}
