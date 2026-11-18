import { cn } from '@/lib/utils';

const PALETTE = [
  ['var(--primary)', 'var(--cyan)'],
  ['var(--cyan)', 'var(--magenta)'],
  ['var(--magenta)', 'var(--primary)'],
] as const;

/** Small stable string hash, so a track always gets the same generated cover. */
function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Stand-in for a missing album cover: a theme-coloured gradient with vinyl grooves and the
 * title's initial. Deterministic per `seed`, and sized by its parent so it scales with the tile.
 */
export function CoverFallback({
  seed,
  label,
  className,
}: {
  seed: string;
  label: string;
  className?: string;
}) {
  const h = hash(seed);
  const [c1, c2] = PALETTE[h % PALETTE.length];
  const angle = 120 + ((h >> 3) % 90);
  const initial = Array.from(label.trim())[0]?.toUpperCase() ?? '♪';

  return (
    <span
      aria-hidden
      className={cn(
        'relative flex shrink-0 items-center justify-center overflow-hidden',
        className,
      )}
      style={{
        containerType: 'size',
        backgroundImage: [
          'repeating-radial-gradient(circle at 50% 50%, transparent 0 9%, color-mix(in oklab, var(--foreground) 8%, transparent) 9% 10%)',
          `linear-gradient(${angle}deg, color-mix(in oklab, ${c1} 34%, var(--card)), color-mix(in oklab, ${c2} 14%, var(--card)))`,
        ].join(', '),
      }}
    >
      <span
        className="font-display leading-none font-bold"
        style={{
          fontSize: '44cqmin',
          color: `color-mix(in oklab, ${c1} 78%, var(--foreground))`,
          textShadow: `0 0 18px color-mix(in oklab, ${c1} 55%, transparent)`,
        }}
      >
        {initial}
      </span>
    </span>
  );
}
