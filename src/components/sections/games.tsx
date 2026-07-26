import Image from 'next/image';
import { ExternalLink, Gamepad2 } from 'lucide-react';
import { games } from '@/lib/data/games';
import { CopyText } from '@/components/ui/copy-text';
import { SteamActivity } from '@/components/sections/steam-activity';
import { SectionHeading } from '@/components/layouts/page-header';

export function Games() {
  return (
    <section className="space-y-8">
      <SectionHeading
        eyebrow="Games"
        jp="ゲーム"
        title="Where to find me in-game"
        icon={Gamepad2}
        description="Some games I play in my free time."
      />

      <ul className="space-y-2">
        {games.map((g) => (
          <li key={g.slug}>
            <a
              href={g.url}
              target="_blank"
              rel="noreferrer noopener"
              className="border-border hover:border-primary/40 bg-card hover:bg-secondary/40 group flex items-center gap-3 rounded-xl border p-3 transition-colors"
            >
              <Image
                src={g.icon}
                alt=""
                width={40}
                height={40}
                className="size-10 shrink-0 rounded-sm object-contain"
              />
              <div className="min-w-0 flex-1">
                <p className="text-foreground group-hover:text-primary truncate text-sm font-medium transition-colors">
                  {g.name}
                </p>
                <div className="text-muted-foreground mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs">
                  {g.identityLabel ? (
                    <span className="text-muted-foreground/70 shrink-0 font-mono tracking-wider uppercase">
                      {g.identityLabel}
                    </span>
                  ) : null}
                  <span className="min-w-0 truncate font-mono">{g.identity}</span>
                  {g.copyable ? (
                    <CopyText value={g.identity} label={g.identityLabel ?? g.name} />
                  ) : null}
                  {g.meta ? (
                    <span className="inline-flex shrink-0 items-center gap-1.5">
                      <span className="text-muted-foreground/50">·</span>
                      <span>{g.meta}</span>
                    </span>
                  ) : null}
                </div>
              </div>
              <ExternalLink size={14} className="text-muted-foreground shrink-0" aria-hidden />
            </a>
          </li>
        ))}
      </ul>

      <SteamActivity />
    </section>
  );
}
