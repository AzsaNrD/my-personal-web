import { Hero } from '@/components/sections/hero';
import { About } from '@/components/sections/about';
import { Portfolio } from '@/components/sections/portfolio';
import { Contact } from '@/components/sections/contact';

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Portfolio />
      <Contact />
    </>
  );
}
