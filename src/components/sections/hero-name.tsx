'use client';

import { useEffect, useRef, useState } from 'react';

const GLYPHS = '!<>-_\/[]{}=+*^?#01';
const FIRST_INTERACTION = ['pointerdown', 'keydown', 'touchstart', 'wheel', 'scroll'] as const;

/** Name that decodes from noise on the visitor's first interaction, then glitches on hover. */
export function HeroName({ name }: { name: string }) {
  const [display, setDisplay] = useState(name);
  const [glitching, setGlitching] = useState(false);
  const ran = useRef(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let intervalId = 0;

    function decode() {
      if (ran.current) return;
      ran.current = true;
      cleanupListeners();

      const total = 34;
      let frame = 0;
      intervalId = window.setInterval(() => {
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
          window.clearInterval(intervalId);
          setDisplay(name);
          setGlitching(true);
          window.setTimeout(() => setGlitching(false), 500);
        }
      }, 38);
    }

    // The scramble is a flourish, and repainting the headline during load would make the browser
    // treat it as the page's largest paint. Wait for the visitor's first interaction instead.
    for (const type of FIRST_INTERACTION) window.addEventListener(type, decode, { passive: true });
    function cleanupListeners() {
      for (const type of FIRST_INTERACTION) window.removeEventListener(type, decode);
    }

    return () => {
      cleanupListeners();
      window.clearInterval(intervalId);
    };
  }, [name]);

  return (
    <span className="relative inline-block">
      <span className="sr-only">{name}</span>
      {/* Invisible copy of the final name holds the layout; the scrambled text is drawn over it. */}
      <span aria-hidden className="font-display invisible block">
        {name}
      </span>
      <span
        aria-hidden
        data-text={display}
        data-glitching={glitching}
        className="glitch neon font-display absolute inset-0"
      >
        {display}
      </span>
    </span>
  );
}
