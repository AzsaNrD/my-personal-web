import { cn } from '@/lib/utils';

/** Endless ticker. Items render twice so the -50% translate loops seamlessly. */
export function Marquee({ items, className }: { items: string[]; className?: string }) {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li
          key={item}
          className="text-muted-foreground flex items-center gap-6 pr-6 font-mono text-xs tracking-[0.2em] uppercase"
        >
          <span>{item}</span>
          <span className="text-primary/60" aria-hidden>
            ◆
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className={cn(
        'marquee-wrap relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]',
        className,
      )}
    >
      <div className="marquee">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
