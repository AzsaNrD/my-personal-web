import { cn } from '@/lib/utils';

const TRACE = 'M0 7H10L13 2L17 12L20 7H30L33 3L36 11L39 7H48';

/** Heartbeat trace shown while a game runs. Decorative: Steam only reports the current game. */
export function PulseLine({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 14"
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('h-3.5 w-12 shrink-0', className)}
    >
      <path d={TRACE} opacity={0.25} />
      <path d={TRACE} pathLength={100} className="pulse-trace" />
    </svg>
  );
}
