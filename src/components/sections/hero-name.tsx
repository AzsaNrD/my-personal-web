'use client';

import { useEffect, useRef, useState } from 'react';

const GLYPHS = '!<>-_\/[]{}=+*^?#01';

/** Name that decodes from noise on load, then glitches on hover. */
export function HeroName({ name }: { name: string }) {
  const [display, setDisplay] = useState(name);
  const [glitching, setGlitching] = useState(false);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const total = 34;
    let frame = 0;
    const id = window.setInterval(() => {
      frame += 1;
      const settled = Math.floor((frame / total) * name.length);
      setDisplay(
        name
          .split('')
          .map((ch, idx) =>
            ch === ' ' || idx < settled ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
          )
          .join(''),
      );
      if (frame >= total) {
        window.clearInterval(id);
        setDisplay(name);
        setGlitching(true);
        window.setTimeout(() => setGlitching(false), 500);
      }
    }, 38);
    return () => window.clearInterval(id);
  }, [name]);

  return (
    <span className="relative inline-block">
      <span className="sr-only">{name}</span>
      <span
        aria-hidden
        data-text={display}
        data-glitching={glitching}
        className="glitch neon font-display"
      >
        {display}
      </span>
    </span>
  );
}
