export default function Loading() {
  return (
    <article className="py-12" aria-busy="true" aria-label="Loading post">
      <div className="bg-muted/60 h-4 w-24 animate-pulse rounded" aria-hidden />
      <header className="mt-8 space-y-3">
        <div className="bg-muted/60 h-3 w-48 animate-pulse rounded" aria-hidden />
        <div className="bg-muted/60 h-9 w-3/4 animate-pulse rounded" aria-hidden />
        <div className="bg-muted/60 h-4 w-2/3 animate-pulse rounded" aria-hidden />
      </header>
      <div className="mt-10 space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-muted/40 h-4 w-full animate-pulse rounded"
            style={{ width: `${85 + ((i * 7) % 15)}%` }}
            aria-hidden
          />
        ))}
      </div>
    </article>
  );
}
