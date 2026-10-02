import { formatDate } from '@/lib/utils';

type PostHeaderProps = {
  title: string;
  description?: string;
  date: string;
  readingMinutes: number;
  /** Extra items for the meta row; each should bring its own separator. */
  children?: React.ReactNode;
};

/** Shared by the blog page and the admin preview so the two cannot drift apart. */
export function PostHeader({
  title,
  description,
  date,
  readingMinutes,
  children,
}: PostHeaderProps) {
  return (
    <header className="border-border border-b pb-8">
      <h1 className="text-foreground text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
      {description && (
        <p className="text-muted-foreground mt-3 max-w-prose text-base leading-relaxed">
          {description}
        </p>
      )}
      <div className="text-muted-foreground mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs">
        <time>{formatDate(date)}</time>
        <span aria-hidden>·</span>
        <span>{readingMinutes} min read</span>
        {children}
      </div>
    </header>
  );
}

export function PostProse({ children }: { children: React.ReactNode }) {
  return (
    <div className="prose prose-zinc dark:prose-invert prose-headings:scroll-mt-24 prose-pre:bg-card prose-pre:border-border prose-pre:border prose-code:before:content-none prose-code:after:content-none prose-code:bg-muted prose-code:rounded prose-code:px-1 prose-code:py-0.5 prose-code:font-normal prose-a:text-primary mt-10 max-w-none">
      {children}
    </div>
  );
}
