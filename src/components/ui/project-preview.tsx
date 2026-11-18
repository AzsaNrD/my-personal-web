import { ImageOff } from 'lucide-react';
import { DiscordIcon } from '@/components/ui/brand-icons';
import { LoadingImage } from '@/components/ui/loading-image';
import { cn } from '@/lib/utils';
import type { Project } from '@/lib/data/projects';

const BRAND_ICON: Record<NonNullable<Project['brand']>, typeof DiscordIcon> = {
  discord: DiscordIcon,
};

const BRAND_LABEL: Record<NonNullable<Project['brand']>, string> = {
  discord: 'Discord bot',
};

/** Official brand color, used only for the icon when no screenshot exists. */
const BRAND_COLOR: Record<NonNullable<Project['brand']>, string> = {
  discord: '#5865F2',
};

export function ProjectPreview({
  project,
  size = 'lg',
  className,
  priority = false,
  sizes,
}: {
  project: Project;
  size?: 'sm' | 'lg';
  className?: string;
  /** Set for the image that is the page's largest paint, so it is preloaded instead of lazy-loaded. */
  priority?: boolean;
  /** Rendered width hint for the srcset; defaults to the card layout on the home page. */
  sizes?: string;
}) {
  if (project.image) {
    return (
      <LoadingImage
        src={project.image}
        alt={`${project.title} screenshot`}
        width={size === 'lg' ? 1280 : 96}
        height={size === 'lg' ? 800 : 64}
        priority={priority}
        fetchPriority={priority ? 'high' : undefined}
        sizes={sizes ?? (size === 'lg' ? '(min-width: 768px) 540px, calc(100vw - 3rem)' : '96px')}
        className={cn(
          'border-border border object-cover object-top',
          size === 'lg' ? 'aspect-video w-full rounded-xl' : 'h-16 w-24 rounded-md',
          className,
        )}
      />
    );
  }

  if (project.brand) {
    const Icon = BRAND_ICON[project.brand];
    const color = BRAND_COLOR[project.brand];
    const lg = size === 'lg';
    return (
      <div
        className={cn(
          'border-border relative flex items-center justify-center overflow-hidden border',
          lg ? 'aspect-video w-full rounded-xl' : 'h-16 w-24 rounded-md',
          className,
        )}
        style={{
          backgroundImage: [
            'repeating-radial-gradient(circle at 50% 50%, transparent 0 11%, color-mix(in oklab, var(--foreground) 6%, transparent) 11% 11.6%)',
            `radial-gradient(circle at 50% 50%, color-mix(in oklab, ${color} 30%, var(--card)), var(--card) 72%)`,
          ].join(', '),
        }}
      >
        <span
          className={cn(
            'bg-card/80 border-border inline-flex items-center justify-center border backdrop-blur-sm',
            lg ? 'size-20 rounded-2xl' : 'size-9 rounded-lg',
          )}
          style={{ boxShadow: `0 0 32px -6px color-mix(in oklab, ${color} 60%, transparent)` }}
        >
          <Icon size={lg ? 40 : 20} style={{ color }} />
        </span>
        {lg ? (
          <span className="text-muted-foreground absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-[11px] tracking-[0.2em] uppercase">
            {BRAND_LABEL[project.brand]}
          </span>
        ) : null}
      </div>
    );
  }

  if (size === 'sm') return null;

  return (
    <div
      className={cn(
        'border-border text-muted-foreground flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-sm',
        className,
      )}
    >
      <ImageOff size={20} aria-hidden />
      No preview available
    </div>
  );
}
