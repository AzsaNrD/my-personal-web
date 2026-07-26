import type { Metadata } from 'next';
import { Music } from '@/components/sections/music';
import { Games } from '@/components/sections/games';
import { PageHeader } from '@/components/layouts/page-header';

export const metadata: Metadata = {
  title: 'Misc',
  description: 'Music, games, anime, and other things I enjoy outside of code.',
};

export default function MiscPage() {
  return (
    <div className="py-12">
      <PageHeader
        eyebrow="Misc"
        jp="雑記"
        title="Miscellaneous"
        description="A small corner for the stuff I'm into outside of work. Music, games, and more coming as I get around to it."
      />

      <div className="[&>*:not(:first-child)]:border-border [&>*:not(:first-child)]:mt-12 [&>*:not(:first-child)]:border-t [&>*:not(:first-child)]:pt-12">
        <Music />
        <Games />
      </div>
    </div>
  );
}
