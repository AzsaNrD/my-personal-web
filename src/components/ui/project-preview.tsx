import { ImageOff } from 'lucide-react';
import { DiscordIcon } from '@/components/ui/brand-icons';
import { LoadingImage } from '@/components/ui/loading-image';
import { cn } from '@/lib/utils';
import type { Project } from '@/lib/data/projects';

const BRAND_ICON: Record<NonNullable<Project['brand']>, typeof DiscordIcon> = {
  discord: DiscordIcon,
};

/** Official brand color, used only for the icon when no screenshot exists. */
const BRAND_COLOR: Record<NonNullable<Project['brand']>, string> = {
  discord: '#5865F2',
};

export function ProjectPreview({
  project,
  size = 'lg',
  className,
}: {
  project: Project;
  size?: 'sm' | 'lg';
  className?: string;
}) {
  if (project.image) {
    return (
      <LoadingImage
        src={project.image}
        alt={`${project.title} screenshot`}
        width={size === 'lg' ? 1280 : 96}
        height={size === 'lg' ? 800 : 64}
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
    return (
      <div
        className={cn(
          'border-border bg-muted/40 flex items-center justify-center border',
          size === 'lg' ? 'aspect-video w-full rounded-xl' : 'h-16 w-24 rounded-md',
          className,
        )}
      >
        <Icon size={size === 'lg' ? 40 : 22} style={{ color: BRAND_COLOR[project.brand] }} />
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
