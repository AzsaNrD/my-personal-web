import { PageHeader } from '@/components/layouts/page-header';

export default function Loading() {
  return (
    <section className="py-12" aria-busy="true" aria-label="Loading blog posts">
      <PageHeader
        eyebrow="Blog"
        jp="記事"
        title="Writings"
        description="Random thoughts and notes. Just things I feel like writing."
      />
      <ul className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <li
            key={i}
            className="border-border bg-muted/40 h-32 animate-pulse rounded-xl border"
            aria-hidden
          />
        ))}
      </ul>
    </section>
  );
}
