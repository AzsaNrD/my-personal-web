'use client';

import { useEffect, useState } from 'react';

/** Types and erases each phrase in turn. Renders the first phrase statically for reduced motion. */
export function Typewriter({ phrases, className }: { phrases: string[]; className?: string }) {
  const [text, setText] = useState(phrases[0] ?? '');

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let phrase = 0;
    let i = phrases[0]?.length ?? 0;
    let deleting = true;
    let timer: number;

    function tick() {
      const current = phrases[phrase];
      if (deleting) {
        i -= 1;
        setText(current.slice(0, Math.max(i, 0)));
        if (i <= 0) {
          deleting = false;
          phrase = (phrase + 1) % phrases.length;
          timer = window.setTimeout(tick, 280);
          return;
        }
        timer = window.setTimeout(tick, 32);
      } else {
        i += 1;
        setText(current.slice(0, i));
        if (i >= current.length) {
          deleting = true;
          timer = window.setTimeout(tick, 2200);
          return;
        }
        timer = window.setTimeout(tick, 62);
      }
    }
    timer = window.setTimeout(tick, 2200);
    return () => window.clearTimeout(timer);
  }, [phrases]);

  return (
    <span className={className}>
      {/* Screen readers get the first phrase once, not every keystroke. */}
      <span className="sr-only">{phrases[0]}</span>
      <span aria-hidden>
        {text}
        <span className="blink-caret bg-primary ml-0.5 inline-block h-[1em] w-[0.5ch] translate-y-[0.15em]" />
      </span>
    </span>
  );
}
