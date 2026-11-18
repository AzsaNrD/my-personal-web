/** Title of the message list, with a running count once the entries are known. */
export function MessagesHeading({ count }: { count?: number }) {
  return (
    <div className="border-border flex items-baseline justify-between gap-3 border-b pb-3">
      <h2 className="text-foreground text-xl font-semibold tracking-tight">
        Messages from visitors
      </h2>
      {count !== undefined ? (
        <span className="text-muted-foreground font-mono text-xs tabular-nums">
          {count >= 100 ? '100+' : count} {count === 1 ? 'message' : 'messages'}
        </span>
      ) : null}
    </div>
  );
}
