import { FadeIn } from '@/components/ui/fade-in';
import { SectionHeading } from '@/components/layouts/page-header';
import { experience, type ExperienceItem } from '@/lib/data/experience';

const CATEGORY_META: Record<ExperienceItem['type'], { label: string; code: string }> = {
  work: { label: 'Work', code: 'WRK' },
  education: { label: 'Education', code: 'EDU' },
  program: { label: 'Independent study', code: 'IND' },
};

const CATEGORY_ORDER: ExperienceItem['type'][] = ['work', 'education', 'program'];

function ExperienceCard({ item }: { item: ExperienceItem }) {
  return (
    <li className="relative pb-6 pl-7 last:pb-0">
      <span
        aria-hidden
        className={
          item.current
            ? 'bg-primary ping-dot absolute top-[1.35rem] left-0 size-2.5 -translate-x-1/2 rounded-full shadow-[0_0_12px_var(--glow-strong)]'
            : 'border-primary/60 bg-background absolute top-[1.35rem] left-0 size-2.5 -translate-x-1/2 rounded-full border-2'
        }
      />
      <span
        aria-hidden
        className="bg-primary/40 absolute top-[1.55rem] left-0 h-px w-7 origin-left"
      />

      <div className="hud-panel p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-foreground text-base font-semibold tracking-tight">{item.role}</h3>
          {item.employmentType ? (
            <span className="text-muted-foreground bg-muted inline-flex items-center px-2 py-0.5 font-mono text-[11px] tracking-wider uppercase">
              {item.employmentType}
            </span>
          ) : null}
          {item.current ? (
            <span className="text-primary bg-primary/10 inline-flex items-center gap-1.5 px-2 py-0.5 font-mono text-[11px] tracking-wider uppercase">
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
        <div className="text-primary/80 mt-3 flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono text-[11px] tracking-wider uppercase">
          {item.period ? <span>{item.period}</span> : null}
          {item.period && item.location ? (
            <span aria-hidden className="text-muted-foreground/50">
              /
            </span>
          ) : null}
          {item.location ? <span className="text-muted-foreground/80">{item.location}</span> : null}
        </div>
      </div>
    </li>
  );
}

export function Experience() {
  return (
    <section id="experience" className="scroll-mt-20 py-14" aria-labelledby="experience-heading">
      <FadeIn>
        <SectionHeading
          eyebrow="Experience"
          jp="経験"
          title="Where I've been"
          titleId="experience-heading"
        />
      </FadeIn>

      <div className="mt-10 space-y-10">
        {CATEGORY_ORDER.map((type) => {
          const items = experience.filter((item) => item.type === type);
          if (!items.length) return null;
          return (
            <FadeIn
              key={type}
              className="grid grid-cols-1 gap-5 lg:grid-cols-[9rem_1fr] lg:gap-8 [&>*]:min-w-0"
            >
              <div className="lg:sticky lg:top-24 lg:self-start">
                <p className="text-primary font-mono text-xs tracking-[0.2em] uppercase">
                  {CATEGORY_META[type].label}
                </p>
                <p
                  aria-hidden
                  className="text-muted-foreground/30 font-display mt-1 text-4xl font-bold tracking-tight"
                >
                  {CATEGORY_META[type].code}
                </p>
              </div>
              <ul className="border-primary/30 ml-1 border-l">
                {items.map((item) => (
                  <ExperienceCard key={item.slug} item={item} />
                ))}
              </ul>
            </FadeIn>
          );
        })}
      </div>
    </section>
  );
}
