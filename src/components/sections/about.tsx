import { FadeIn } from '@/components/ui/fade-in';
import { SectionHeading } from '@/components/layouts/page-header';

const skills = [
  'React',
  'Next.js',
  'Laravel',
  'TypeScript',
  'Tailwind CSS',
  'Node.js',
  'Python',
  'MongoDB',
  'MySQL',
  'PostgreSQL',
  'Git',
];

export function About() {
  return (
    <section id="about" className="py-10" aria-labelledby="about-heading">
      <FadeIn>
        <SectionHeading eyebrow="About" jp="自己紹介" title="About me" titleId="about-heading" />
        <div className="text-muted-foreground mt-5 space-y-4 leading-relaxed">
          <p>
            I&apos;m a recent Information Systems graduate from Universitas Gunadarma, and most of
            my time goes into building web apps that solve real problems. I learn best by shipping,
            and I also gained experience in machine learning through Asah, an independent study
            program by Dicoding.
          </p>
          <p>
            Outside of code I&apos;m usually playing Genshin Impact, watching anime, or listening to
            EDM. Attack on Titan is one of my favorites.{' '}
            <span className="text-foreground font-medium italic">
              Shinzou wo sasageyo, tatakae!
            </span>
          </p>
        </div>

        <ul className="mt-8 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <li
              key={skill}
              className="border-border bg-secondary text-secondary-foreground border px-2.5 py-1 font-mono text-xs"
            >
              {skill}
            </li>
          ))}
        </ul>
      </FadeIn>
    </section>
  );
}
