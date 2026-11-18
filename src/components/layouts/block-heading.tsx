import { Eyebrow } from '@/components/layouts/page-header';

/** Compact heading for a block inside a page that already has its own header. */
export function BlockHeading({
  eyebrow,
  jp,
  title,
  titleId,
  icon,
  action,
}: {
  eyebrow: string;
  jp?: string;
  title: string;
  /** Set when the parent section uses aria-labelledby. */
  titleId?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  /** Optional link or control aligned to the right of the title. */
  action?: React.ReactNode;
}) {
  return (
    <header className="border-border flex items-end justify-between gap-4 border-b pb-3">
      <div className="min-w-0">
        <Eyebrow jp={jp} icon={icon}>
          {eyebrow}
        </Eyebrow>
        <h2
          id={titleId}
          className="text-foreground mt-2 text-xl font-semibold tracking-tight md:text-2xl"
        >
          {title}
        </h2>
      </div>
      {action ? <div className="shrink-0 pb-0.5 text-sm">{action}</div> : null}
    </header>
  );
}

/** Small mono label that titles a group of cards inside a block. */
export function SubLabel({
  children,
  icon: Icon,
}: {
  children: React.ReactNode;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}) {
  return (
    <h3 className="text-muted-foreground mb-3 flex items-center gap-2 font-mono text-[11px] tracking-wider uppercase">
      {Icon ? (
        <Icon size={12} className="shrink-0" />
      ) : (
        <span className="text-primary/60" aria-hidden>
          //
        </span>
      )}
      {children}
    </h3>
  );
}
