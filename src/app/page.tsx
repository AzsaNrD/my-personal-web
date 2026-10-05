import { Hero } from '@/components/sections/hero';
import { About } from '@/components/sections/about';
import { Experience } from '@/components/sections/experience';
import { Portfolio } from '@/components/sections/portfolio';
import { Contact } from '@/components/sections/contact';
import { JsonLd } from '@/components/seo/json-ld';
import { siteConfig } from '@/lib/site-config';

const person = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: siteConfig.name,
  url: siteConfig.url,
  jobTitle: siteConfig.role,
  description: siteConfig.bio,
  sameAs: [siteConfig.links.github, siteConfig.links.linkedin, siteConfig.links.instagram],
};

const website = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteConfig.name,
  url: siteConfig.url,
  inLanguage: 'en',
};

export default function Home() {
  return (
    <>
      <JsonLd data={person} />
      <JsonLd data={website} />
      <Hero />
      <About />
      <Experience />
      <Portfolio />
      <Contact />
    </>
  );
}
