import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { GithubIcon } from '@/components/ui/brand-icons';
import { Button } from '@/components/ui/button';
import { ProjectPreview } from '@/components/ui/project-preview';
import { projects } from '@/lib/data/projects';

type RouteParams = { slug: string };

export function generateStaticParams(): RouteParams[] {
  return projects.map((project) => ({ slug: project.slug }));
}

export function generateMetadata({ params }: { params: Promise<RouteParams> }): Promise<Metadata> {
  return params.then(({ slug }) => {
    const project = projects.find((p) => p.slug === slug);
    if (!project) return {};
    return { title: project.title, description: project.description };
  });
}

export default async function ProjectPage({ params }: { params: Promise<RouteParams> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <article className="py-12">
      <Link
        href="/#portfolio"
        className="text-muted-foreground hover:text-primary mb-8 inline-flex items-center gap-1.5 text-xs font-medium transition-colors"
      >
        <ArrowLeft size={14} aria-hidden />
        Back to portfolio
      </Link>

      <ProjectPreview project={project} size="lg" />

      <header className="mt-8">
        <h1 className="text-foreground text-3xl font-bold tracking-tight md:text-4xl">
          {project.title}
        </h1>
        <p className="text-muted-foreground mt-3 max-w-prose text-base leading-relaxed">
          {project.description}
        </p>
      </header>

      <div className="mt-6">
        <h2 className="text-muted-foreground mb-3 font-mono text-[11px] tracking-wider uppercase">
          Built with
        </h2>
        <ul className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="bg-muted text-muted-foreground rounded-md px-2.5 py-1 font-mono text-xs"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>

      {(project.repo || project.demo) && (
        <div className="mt-8 flex flex-wrap items-center gap-2.5">
          {project.repo && (
            <Button
              size="default"
              variant="outline"
              className="h-10 gap-2 px-4 text-sm"
              nativeButton={false}
              render={<a href={project.repo} target="_blank" rel="noreferrer noopener" />}
            >
              <GithubIcon size={15} />
              View source
            </Button>
          )}
          {project.demo && (
            <Button
              size="default"
              className="h-10 gap-2 px-4 text-sm font-semibold"
              nativeButton={false}
              render={<a href={project.demo} target="_blank" rel="noreferrer noopener" />}
            >
              Live demo
              <ExternalLink size={15} aria-hidden />
            </Button>
          )}
        </div>
      )}
    </article>
  );
}
