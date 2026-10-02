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
import { PostHeader, PostProse } from '@/components/blog/post-layout';

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

      <PostHeader
        title={post.title}
        description={post.description}
        date={post.date}
        readingMinutes={post.readingMinutes}
      >
        <span aria-hidden>·</span>
        <ViewCounter slug={post.slug} trackView />
        <span aria-hidden>·</span>
        <ShareButton title={post.title} slug={post.slug} />
      </PostHeader>

      <PostProse>
        <MDXRemote source={post.content} options={mdxOptions} components={mdxComponents} />
      </PostProse>
    </article>
  );
}
