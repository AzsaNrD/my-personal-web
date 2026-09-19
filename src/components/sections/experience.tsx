import { FadeIn } from '@/components/ui/fade-in';
import { SectionHeading } from '@/components/layouts/page-header';
import { experience, type ExperienceItem } from '@/lib/data/experience';

const CATEGORY_META: Record<ExperienceItem['type'], { label: string }> = {
  work: { label: 'Work' },
  education: { label: 'Education' },
  program: { label: 'Independent study' },
};

const CATEGORY_ORDER: ExperienceItem['type'][] = ['work', 'education', 'program'];

function ExperienceRow({ item }: { item: ExperienceItem }) {
  return (
    <li className="border-border border-b py-5 sm:py-6">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-foreground text-base font-semibold tracking-tight">{item.role}</h3>
        {item.employmentType ? (
          <span className="text-muted-foreground bg-muted inline-flex items-center px-2 py-0.5 font-mono text-[10px] tracking-wider uppercase">
            {item.employmentType}
          </span>
        ) : null}
        {item.current ? (
          <span className="text-primary bg-primary/10 inline-flex items-center gap-1.5 px-2 py-0.5 font-mono text-[10px] tracking-wider uppercase">
            <span className="bg-primary size-1.5 rounded-full" aria-hidden />
            Ongoing
          </span>
        ) : null}
      </div>
      <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{item.org}</p>
      {item.orgDetail ? (
        <p className="text-muted-foreground/70 mt-1 text-xs leading-relaxed">{item.orgDetail}</p>
      ) : null}
      {item.description ? (
        <p className="text-muted-foreground mt-2 max-w-prose text-sm leading-relaxed">
          {item.description}
        </p>
      ) : null}
      <div className="text-muted-foreground/70 mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono text-[11px] tracking-wider uppercase">
        {item.period ? <span>{item.period}</span> : null}
        {item.period && item.location ? <span aria-hidden>·</span> : null}
        {item.location ? <span>{item.location}</span> : null}
      </div>
    </li>
  );
}

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

      <div className="mt-8 space-y-8">
        {CATEGORY_ORDER.map((type) => {
          const items = experience.filter((item) => item.type === type);
          if (!items.length) return null;
          return (
            <FadeIn key={type}>
              <p className="text-muted-foreground font-mono text-xs tracking-[0.2em] uppercase">
                {CATEGORY_META[type].label}
              </p>
              <ul className="border-border mt-3 border-t">
                {items.map((item) => (
                  <ExperienceRow key={item.slug} item={item} />
                ))}
              </ul>
            </FadeIn>
          );
        })}
      </div>
    </section>
  );
}
