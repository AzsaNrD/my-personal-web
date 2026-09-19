import { FadeIn } from '@/components/ui/fade-in';
import { SectionHeading } from '@/components/layouts/page-header';
import { experience, type ExperienceItem } from '@/lib/data/experience';

const TYPE_LABEL: Record<ExperienceItem['type'], string> = {
  work: 'Work',
  education: 'Education',
  program: 'Program',
};

export function Experience() {
  return (
    <section id="experience" className="py-10" aria-labelledby="experience-heading">
      <FadeIn>
        <SectionHeading
          eyebrow="Experience"
          jp="経験"
          title="Where I've been"
          titleId="experience-heading"
        />
      </FadeIn>

      <ol className="border-border mt-8 border-t">
        {experience.map((item, idx) => (
          <li key={item.slug} className="border-border border-b">
            <FadeIn
              delay={idx * 0.05}
              className="flex flex-col gap-1 py-5 sm:flex-row sm:gap-6 sm:py-6"
            >
              <div className="text-muted-foreground w-full shrink-0 font-mono text-xs sm:w-32">
                {item.period || TYPE_LABEL[item.type]}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-foreground text-base font-semibold tracking-tight">
                    {item.role}
                  </h3>
                  {item.current ? (
                    <span className="text-primary bg-primary/10 inline-flex items-center gap-1.5 px-2 py-0.5 font-mono text-[10px] tracking-wider uppercase">
                      <span className="bg-primary size-1.5 rounded-full" aria-hidden />
                      Ongoing
                    </span>
                  ) : null}
                </div>
                <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{item.org}</p>
                {item.orgDetail ? (
                  <p className="text-muted-foreground/70 mt-1 text-xs leading-relaxed">
                    {item.orgDetail}
                  </p>
                ) : null}
                {item.location ? (
                  <p className="text-muted-foreground/70 mt-1.5 font-mono text-[11px] tracking-wider uppercase">
                    {item.location}
                  </p>
                ) : null}
              </div>
            </FadeIn>
          </li>
        ))}
      </ol>
    </section>
  );
}
