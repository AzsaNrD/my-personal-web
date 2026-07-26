'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { ArrowLeft, RotateCw } from 'lucide-react';

export default function PostError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[blog post error]', error);
  }, [error]);

  return (
    <article className="py-12">
      <Link
        href="/blog"
        className="text-muted-foreground hover:text-primary mb-8 inline-flex items-center gap-1.5 text-xs font-medium transition-colors"
      >
        <ArrowLeft size={14} aria-hidden />
        Back to blog
      </Link>
      <div className="border-border bg-card rounded-xl border border-dashed p-10 text-center">
        <p className="text-primary font-mono text-xs font-medium tracking-[0.18em] uppercase">
          Error
        </p>
        <h1 className="text-foreground mt-2 text-2xl font-semibold tracking-tight">
          Could not load this post
        </h1>
        <p className="text-muted-foreground mx-auto mt-3 max-w-sm text-sm leading-relaxed">
          Something went wrong while rendering the article. Try again, or head back to the index.
        </p>
        <button
          type="button"
          onClick={reset}
          className="border-border hover:border-primary hover:text-primary mt-6 inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-xs font-medium transition-colors"
        >
          <RotateCw size={12} aria-hidden />
          Try again
        </button>
      </div>
    </article>
  );
}
