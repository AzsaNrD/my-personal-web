import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { FadeIn } from '@/components/ui/fade-in';
import { SectionHeading } from '@/components/layouts/page-header';
import { ProjectPreview } from '@/components/ui/project-preview';
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
          <li key={project.slug} className="border-border border-b">
            <FadeIn delay={idx * 0.05}>
              <Link
                href={`/portfolio/${project.slug}`}
                className="group hover:bg-secondary/30 flex items-start gap-3 py-5 transition-colors sm:gap-5 sm:py-6"
              >
                <span
                  aria-hidden
                  className="text-muted-foreground/40 group-hover:text-primary w-6 shrink-0 pt-1 font-mono text-sm tabular-nums transition-colors sm:w-7"
                >
                  {String(idx + 1).padStart(2, '0')}
                </span>

                <div className="hidden shrink-0 sm:block">
                  <ProjectPreview project={project} size="sm" />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-foreground group-hover:text-primary text-base font-semibold tracking-tight transition-colors sm:text-lg">
                    {project.title}
                  </h3>

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

                <ArrowRight
                  size={16}
                  aria-hidden
                  className="text-muted-foreground/40 group-hover:text-primary mt-1.5 shrink-0 transition-colors"
                />
              </Link>
            </FadeIn>
          </li>
        ))}
      </ol>
    </section>
  );
}
