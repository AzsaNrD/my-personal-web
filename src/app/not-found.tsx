import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: '404 · Not Found',
  description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <section className="py-24 text-center md:py-32" aria-label="Page not found">
      <p className="text-muted-foreground font-mono text-sm tracking-[0.2em]">404</p>

      <h1 className="font-display mt-4 text-4xl font-bold tracking-tight md:text-5xl">
        <span className="from-brand-600 to-brand-400 bg-gradient-to-r bg-clip-text text-transparent">
          Page not found
        </span>
      </h1>

      <p className="text-muted-foreground mx-auto mt-4 max-w-md leading-relaxed">
        The page you&apos;re looking for can&apos;t be found. It may have moved, or never existed in
        the first place.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button
          size="default"
          className="h-10 gap-2 px-4 text-sm"
          nativeButton={false}
          render={<Link href="/" />}
        >
          <Home size={16} aria-hidden />
          Back home
        </Button>
        <Button
          size="default"
          variant="outline"
          className="h-10 gap-2 px-4 text-sm"
          nativeButton={false}
          render={<Link href="/blog" />}
        >
          <ArrowLeft size={16} aria-hidden />
          Read the blog
        </Button>
      </div>
    </section>
  );
}
