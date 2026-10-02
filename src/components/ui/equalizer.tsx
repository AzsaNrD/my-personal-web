import { cn } from '@/lib/utils';

const BARS = [
  { height: 0.5, duration: '0.9s', delay: '0s' },
  { height: 0.9, duration: '1.1s', delay: '-0.4s' },
  { height: 0.65, duration: '0.8s', delay: '-0.7s' },
  { height: 0.8, duration: '1.3s', delay: '-0.2s' },
];

/** Level bars shown while a track plays. Simulated: Last.fm exposes no audio data. */
export function Equalizer({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn('inline-flex h-3.5 items-end gap-[2px]', className)}>
      {BARS.map((bar, i) => (
        <span
          key={i}
          className="eq-bar h-full w-[3px] rounded-[1px] bg-current"
          style={{
            ['--eq-h' as string]: bar.height,
            animationDuration: bar.duration,
            animationDelay: bar.delay,
          }}
        />
      ))}
    </span>
  );
}
