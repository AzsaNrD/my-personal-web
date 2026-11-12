import { cn } from '@/lib/utils';

const BAR_COUNT = 32;

/** Deterministic per-bar timing so server and client render identical markup. */
const BARS = Array.from({ length: BAR_COUNT }, (_, i) => ({
  height: 0.35 + (((i * 7) % 11) / 11) * 0.65,
  duration: `${0.7 + (((i * 5) % 9) / 9) * 0.9}s`,
  delay: `${-(((i * 3) % 8) / 8) * 1.2}s`,
}));

/** Wide strip of level bars. Simulated: Last.fm exposes no audio data. */
export function Visualizer({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn('flex h-full items-end gap-[3px]', className)}>
      {BARS.map((bar, i) => (
        <span
          key={i}
          className="viz-bar h-full min-w-0 flex-1 rounded-t-[1px] bg-gradient-to-t from-[var(--primary)] to-[var(--cyan)]"
          style={{
            transform: `scaleY(${bar.height})`,
            animationDuration: bar.duration,
            animationDelay: bar.delay,
          }}
        />
      ))}
    </span>
  );
}
