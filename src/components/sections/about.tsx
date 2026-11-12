import { FadeIn } from '@/components/ui/fade-in';
import { SectionHeading } from '@/components/layouts/page-header';
import { skills } from '@/lib/data/skills';

export function About() {
  return (
    <section id="about" className="scroll-mt-20 py-14" aria-labelledby="about-heading">
      <FadeIn>
        <SectionHeading eyebrow="About" jp="自己紹介" title="About me" titleId="about-heading" />
      </FadeIn>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        <FadeIn className="text-muted-foreground space-y-4 leading-relaxed">
          <p className="text-foreground/90 text-lg leading-relaxed">
            I&apos;m an Information Systems graduate from Universitas Gunadarma. I build web apps,
            and I&apos;m exploring cybersecurity along the way.
          </p>
          <p>
            I learn best by shipping, and I also gained experience in machine learning through Asah,
            an independent study program by Dicoding.
          </p>
          <p>
            Outside of code I&apos;m usually playing games like Genshin Impact, watching anime, or
            listening to EDM. Attack on Titan is one of my favorites.
          </p>
          <blockquote className="border-primary/60 text-foreground mt-2 border-l-2 pl-4 font-mono text-sm italic">
            Shinzou wo sasageyo, tatakae!
          </blockquote>
        </FadeIn>

        <FadeIn delay={0.1}>
          <p className="text-muted-foreground mb-3 font-mono text-[11px] tracking-[0.22em] uppercase">
            <span className="text-primary/60" aria-hidden>
              //{' '}
            </span>
            Toolkit
          </p>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {skills.map((skill, idx) => (
              <li
                key={skill}
                className="border-border bg-secondary/50 hover:border-primary/60 hover:bg-primary/10 hover:text-primary group relative overflow-hidden border px-3 py-2.5 font-mono text-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_18px_-6px_var(--glow-strong)]"
              >
                <span className="text-muted-foreground/40 group-hover:text-primary/70 mr-2 transition-colors">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                {skill}
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </section>
  );
}
