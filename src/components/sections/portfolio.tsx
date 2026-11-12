import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { FadeIn } from '@/components/ui/fade-in';
import { SectionHeading } from '@/components/layouts/page-header';
import { ProjectPreview } from '@/components/ui/project-preview';
import { Tilt } from '@/components/ui/tilt';
import { projects } from '@/lib/data/projects';
import { cn } from '@/lib/utils';

export function Portfolio() {
  return (
    <section id="portfolio" className="scroll-mt-20 py-14" aria-labelledby="portfolio-heading">
      <FadeIn>
        <SectionHeading
          eyebrow="Portfolio"
          jp="作品"
          title="Selected work"
          titleId="portfolio-heading"
          description="A few things I've built. The list grows as I ship more."
        />
      </FadeIn>

      <ol className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 [&>*]:min-w-0">
        {projects.map((project, idx) => {
          // Only an odd count needs a full-width lead card; an even count pairs up cleanly.
          const featured = idx === 0 && projects.length % 2 === 1;
          return (
            <li key={project.slug} className={cn(featured && 'md:col-span-2')}>
              <FadeIn delay={(idx % 2) * 0.08} className="h-full">
                <Tilt max={2.5} className="h-full">
                  <Link
                    href={`/portfolio/${project.slug}`}
                    className={cn(
                      'hud-panel hud-corners group flex h-full flex-col gap-5 p-4 outline-none sm:p-5',
                      featured && 'lg:grid lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-8',
                    )}
                  >
                    <div className="relative overflow-hidden">
                      <ProjectPreview
                        project={project}
                        size="lg"
                        className="transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                      <span
                        aria-hidden
                        className="bg-background/80 text-primary absolute top-2 left-2 px-2 py-0.5 font-mono text-[11px] tracking-widest backdrop-blur"
                      >
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-foreground group-hover:text-primary font-display text-xl font-semibold tracking-tight transition-colors sm:text-2xl">
                          {project.title}
                        </h3>
                        <ArrowUpRight
                          size={20}
                          aria-hidden
                          className="text-muted-foreground/50 group-hover:text-primary mt-1 shrink-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </div>

                      <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                        {project.description}
                      </p>

                      <ul className="mt-4 flex flex-wrap gap-1.5">
                        {project.tags.map((tag) => (
                          <li
                            key={tag}
                            className="border-primary/25 text-primary/90 bg-primary/5 border px-2 py-0.5 font-mono text-[11px]"
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Link>
                </Tilt>
              </FadeIn>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
