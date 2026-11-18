/** Eyebrow label shared by page headers and in-page sections. */
export function Eyebrow({
  children,
  jp,
  icon: Icon,
}: {
  children: React.ReactNode;
  jp?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}) {
  return (
    <p className="flex items-center gap-2 font-mono text-[11px] font-medium tracking-[0.22em] uppercase">
      <span className="text-primary/60" aria-hidden>
        //
      </span>
      {Icon ? <Icon size={12} className="text-primary shrink-0" /> : null}
      <span className="text-primary">{children}</span>
      {jp ? (
        <>
          <span className="text-muted-foreground/40" aria-hidden>
            /
          </span>
          <span lang="ja" className="text-muted-foreground normal-case">
            {jp}
          </span>
        </>
      ) : null}
    </p>
  );
}

export function PageHeader({
  eyebrow,
  jp,
  title,
  description,
  action,
}: {
  eyebrow: string;
  jp?: string;
  title: string;
  description?: React.ReactNode;
  /** Optional control shown at the top-right of the header, e.g. an owner-only action. */
  action?: React.ReactNode;
}) {
  return (
    <header className="border-border relative mb-10 animate-[rise-up_0.6s_ease-out_both] border-b pb-8">
      <div
        aria-hidden
        className="grid-bg pointer-events-none absolute top-[-4rem] left-1/2 -z-10 h-[17rem] w-screen -translate-x-1/2"
      />
      <Eyebrow jp={jp}>{eyebrow}</Eyebrow>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-foreground text-4xl font-bold tracking-tight [word-spacing:0.1em] md:text-5xl">
            {title}
          </h1>
          <span
            aria-hidden
            className="mt-4 block h-0.5 w-16 bg-gradient-to-r from-[var(--primary)] via-[var(--cyan)] to-[var(--magenta)] shadow-[0_0_10px_var(--glow-strong)]"
          />
          {description ? (
            <p className="text-muted-foreground mt-3 max-w-prose text-sm leading-relaxed">
              {description}
            </p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </header>
  );
}

export function SectionHeading({
  eyebrow,
  jp,
  title,
  titleId,
  description,
  icon,
}: {
  eyebrow: string;
  jp?: string;
  title: string;
  /** Set when the parent section uses aria-labelledby. */
  titleId?: string;
  description?: React.ReactNode;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}) {
  return (
    <div>
      <Eyebrow jp={jp} icon={icon}>
        {eyebrow}
      </Eyebrow>
      <h2
        id={titleId}
        className="text-foreground mt-3 text-2xl font-semibold tracking-tight md:text-3xl"
      >
        {title}
      </h2>
      <span
        aria-hidden
        className="mt-3 block h-0.5 w-12 bg-gradient-to-r from-[var(--primary)] to-[var(--cyan)] shadow-[0_0_10px_var(--glow-strong)]"
      />
      {description ? (
        <p className="text-muted-foreground mt-3 max-w-prose text-sm leading-relaxed">
          {description}
        </p>
      ) : null}
    </div>
  );
}
