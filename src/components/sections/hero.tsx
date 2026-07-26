import Link from 'next/link';
import { ArrowRight, Mail, Music2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NowPlaying } from '@/components/integrations/lastfm/now-playing';
import { HeroName } from '@/components/sections/hero-name';
import { siteConfig } from '@/lib/site-config';

export function Hero() {
  return (
    <section className="relative pt-14 pb-8 md:pt-20 md:pb-10" aria-label="Introduction">
      {/* Side marker — the theme's single magenta accent */}
      <span
        aria-hidden
        className="text-accent-magenta/35 pointer-events-none absolute top-14 right-0 hidden font-mono text-[10px] tracking-[0.4em] select-none sm:block"
        style={{ writingMode: 'vertical-rl' }}
      >
        光 · {new Date().getFullYear()}
      </span>

      <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.22em] uppercase">
        <span className="bg-primary h-3 w-0.5 shrink-0" aria-hidden />
        <span className="text-primary">{siteConfig.role}</span>
        <span className="text-muted-foreground/50">/</span>
        <span className="text-muted-foreground">インドネシア</span>
      </div>

      <h1 className="font-display mt-4 text-4xl font-bold tracking-tight md:text-6xl">
        Hi, I&apos;m <HeroName name={siteConfig.name} />
      </h1>

      <p className="text-muted-foreground mt-4 max-w-prose text-base leading-relaxed">
        {siteConfig.bio}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-2.5">
        <Button
          size="default"
          className="h-10 gap-2 px-4 text-sm font-semibold"
          nativeButton={false}
          render={<Link href="#portfolio" />}
        >
          See my work
          <ArrowRight size={15} aria-hidden />
        </Button>
        <Button
          size="default"
          variant="outline"
          className="h-10 gap-2 px-4 text-sm"
          nativeButton={false}
          render={<Link href="#contact" />}
        >
          <Mail size={15} aria-hidden />
          Get in touch
        </Button>
      </div>

      <div className="border-border bg-secondary/40 text-muted-foreground mt-6 inline-flex max-w-full items-center gap-2 border px-3 py-1.5 font-mono text-xs">
        <Music2 size={13} className="text-primary shrink-0" aria-hidden />
        <NowPlaying />
      </div>
    </section>
  );
}
