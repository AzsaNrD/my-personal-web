'use client';

import { useEffect, useState } from 'react';

const SESSION_KEY = 'hero-shimmer-played';

export function HeroName({ name }: { name: string }) {
  const [shimmer, setShimmer] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    sessionStorage.setItem(SESSION_KEY, '1');
    setShimmer(true);
  }, []);

  return (
    <span className="relative inline-block">
      {/* Solid accent with a single soft glow — the theme's one glowing element */}
      <span className="text-primary [text-shadow:0_0_28px_var(--name-glow)]">{name}</span>
      {shimmer && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 [animation:hero-shimmer_1.8s_ease-out_forwards] [background-image:linear-gradient(100deg,transparent_46%,rgba(255,255,255,0.9)_50%,transparent_54%)] [background-size:250%_100%] bg-clip-text text-transparent"
        >
          {name}
        </span>
      )}
    </span>
  );
}
