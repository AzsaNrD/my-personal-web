import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowUpRight, Plus } from 'lucide-react';
import { getAllPosts } from '@/lib/mdx';
import { formatDate } from '@/lib/utils';
import { ViewCounter } from '@/components/blog/view-counter';
import { PageHeader } from '@/components/layouts/page-header';
import { Button } from '@/components/ui/button';
import { Tilt } from '@/components/ui/tilt';
import { auth } from '@/lib/auth';
import { isOwnerKey, userKey } from '@/lib/is-owner';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Writings, dev notes, and small things I feel like sharing.',
};

export default async function BlogIndexPage() {
  const [posts, session] = await Promise.all([getAllPosts(), auth()]);
  const isOwner = isOwnerKey(userKey(session?.user?.provider, session?.user?.providerAccountId));

  return (
    <section className="py-12">
      <PageHeader
        eyebrow="Blog"
        jp="記事"
        title="Writings"
        description="Random thoughts and notes. Just things I feel like writing."
        action={
          isOwner ? (
            <Button
              size="default"
              className="h-9 gap-1.5 px-3 text-sm"
              nativeButton={false}
              render={<Link href="/admin/new-post" />}
            >
              <Plus size={15} aria-hidden />
              New post
            </Button>
          ) : null
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
              <Tilt max={3}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="glass glass-hover group block rounded-xl p-5"
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
              </Tilt>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
