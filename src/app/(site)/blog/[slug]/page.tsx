import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getAllSlugs, getPostBySlug } from '@/lib/mdx';
import { mdxOptions } from '@/lib/mdx/options';
import { mdxComponents } from '@/components/blog/mdx-components';
import { ViewCounter } from '@/components/blog/view-counter';
import { ShareButton } from '@/components/blog/share-button';
import { formatDate } from '@/lib/utils';

type RouteParams = { slug: string };

export async function generateStaticParams(): Promise<RouteParams[]> {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<RouteParams> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="py-12">
      <Link
        href="/blog"
        className="text-muted-foreground hover:text-primary mb-8 inline-flex items-center gap-1.5 text-xs font-medium transition-colors"
      >
        <ArrowLeft size={14} aria-hidden />
        Back to blog
      </Link>

      <header className="border-border border-b pb-8">
        <h1 className="text-foreground text-3xl font-bold tracking-tight md:text-4xl">
          {post.title}
        </h1>
        {post.description && (
          <p className="text-muted-foreground mt-3 max-w-prose text-base leading-relaxed">
            {post.description}
          </p>
        )}
        <div className="text-muted-foreground mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs">
          <time>{formatDate(post.date)}</time>
          <span aria-hidden>·</span>
          <span>{post.readingMinutes} min read</span>
          <span aria-hidden>·</span>
          <ViewCounter slug={post.slug} trackView />
          <span aria-hidden>·</span>
          <ShareButton title={post.title} slug={post.slug} />
        </div>
      </header>

      <div className="prose prose-zinc dark:prose-invert prose-headings:scroll-mt-24 prose-pre:bg-card prose-pre:border-border prose-pre:border prose-code:before:content-none prose-code:after:content-none prose-code:bg-muted prose-code:rounded prose-code:px-1 prose-code:py-0.5 prose-code:font-normal prose-a:text-primary mt-10 max-w-none">
        <MDXRemote source={post.content} options={mdxOptions} components={mdxComponents} />
      </div>
    </article>
  );
}
