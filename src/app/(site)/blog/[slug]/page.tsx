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
import { JsonLd } from '@/components/seo/json-ld';
import { siteConfig } from '@/lib/site-config';

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
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      tags: post.tags,
      locale: post.lang === 'en' ? 'en_US' : 'id_ID',
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<RouteParams> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const lang = post.lang ?? 'id';
  const url = `${siteConfig.url}/blog/${post.slug}`;
  const article = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: lang,
    keywords: post.tags?.join(', '),
    url,
    mainEntityOfPage: url,
    author: { '@type': 'Person', name: siteConfig.name, url: siteConfig.url },
  };

  return (
    <article className="py-12">
      <JsonLd data={article} />
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
        lang={lang}
      >
        <span aria-hidden>·</span>
        <ViewCounter slug={post.slug} trackView />
        <span aria-hidden>·</span>
        <ShareButton title={post.title} slug={post.slug} />
      </PostHeader>

      <PostProse lang={lang}>
        <MDXRemote source={post.content} options={mdxOptions} components={mdxComponents} />
      </PostProse>
    </article>
  );
}
