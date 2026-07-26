import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { GithubIcon } from '@/components/ui/brand-icons';
import { FadeIn } from '@/components/ui/fade-in';
import { SectionHeading } from '@/components/layouts/page-header';
import { projects } from '@/lib/data/projects';

export function Portfolio() {
  return (
    <section id="portfolio" className="py-10" aria-labelledby="portfolio-heading">
      <FadeIn>
        <SectionHeading
          eyebrow="Portfolio"
          jp="作品"
          title="Selected work"
          titleId="portfolio-heading"
          description="A few things I've built. The list grows as I ship more."
        />
      </FadeIn>

      <ol className="border-border mt-8 border-t">
        {projects.map((project, idx) => (
          <li
            key={project.slug}
            className="group border-border hover:bg-secondary/30 border-b transition-colors"
          >
            <FadeIn delay={idx * 0.05} className="flex gap-3 py-5 sm:gap-5 sm:py-6">
              <span
                aria-hidden
                className="text-muted-foreground/40 group-hover:text-primary w-6 shrink-0 pt-1 font-mono text-sm tabular-nums transition-colors sm:w-7"
              >
                {String(idx + 1).padStart(2, '0')}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-foreground group-hover:text-primary text-base font-semibold tracking-tight transition-colors sm:text-lg">
                    {project.title}
                  </h3>
                  <div className="-mt-1 flex shrink-0 items-center gap-0.5">
                    {project.repo && (
                      <Link
                        href={project.repo}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label={`${project.title} repository`}
                        className="text-muted-foreground hover:text-primary hover:bg-secondary inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
                      >
                        <GithubIcon size={16} />
                      </Link>
                    )}
                    {project.demo && (
                      <Link
                        href={project.demo}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label={`${project.title} live demo`}
                        className="text-muted-foreground hover:text-primary hover:bg-secondary inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
                      >
                        <ExternalLink size={16} aria-hidden />
                      </Link>
                    )}
                  </div>
                </div>

                <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                  {project.description}
                </p>

                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <li
                      key={tag}
                      className="bg-muted text-muted-foreground rounded-md px-2 py-0.5 font-mono text-[11px]"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </li>
        ))}
      </ol>
    </section>
  );
}
