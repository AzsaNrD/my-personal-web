import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowUpRight } from 'lucide-react';
import { getAllPosts } from '@/lib/mdx';
import { formatDate } from '@/lib/utils';
import { ViewCounter } from '@/components/blog/view-counter';
import { PageHeader } from '@/components/layouts/page-header';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Writings, dev notes, and small things I feel like sharing.',
};

export default async function BlogIndexPage() {
  const posts = await getAllPosts();

  return (
    <section className="py-12">
      <PageHeader
        eyebrow="Blog"
        jp="記事"
        title="Writings"
        description={
          <>
            Random thoughts and notes. Just things I feel like writing. Subscribe via{' '}
            <a
              href="/rss.xml"
              className="text-primary underline-offset-2 hover:underline"
              target="_blank"
              rel="noreferrer noopener"
            >
              RSS
            </a>
            .
          </>
        }
      />

      {posts.length === 0 ? (
        <p className="text-muted-foreground border-border rounded-xl border border-dashed p-10 text-center text-sm">
          No posts yet. Check back later.
        </p>
      ) : (
        <ul className="space-y-3">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group border-border hover:border-primary/40 bg-card block rounded-xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/5"
              >
                <div className="text-muted-foreground flex flex-wrap items-center gap-2 font-mono text-[11px]">
                  <time>{formatDate(post.date)}</time>
                  <span aria-hidden>·</span>
                  <span>{post.readingMinutes} min read</span>
                  <span aria-hidden>·</span>
                  <ViewCounter slug={post.slug} />
                </div>

                <div className="mt-2 flex items-start justify-between gap-3">
                  <h2 className="text-foreground group-hover:text-primary text-lg font-semibold tracking-tight transition-colors">
                    {post.title}
                  </h2>
                  <ArrowUpRight
                    size={16}
                    aria-hidden
                    className="text-muted-foreground/40 group-hover:text-primary mt-1 shrink-0 transition-colors"
                  />
                </div>

                {post.description && (
                  <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                    {post.description}
                  </p>
                )}

                {post.tags && post.tags.length > 0 ? (
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <li
                        key={tag}
                        className="bg-muted text-muted-foreground rounded-md px-2 py-0.5 font-mono text-[11px]"
                      >
                        #{tag}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
