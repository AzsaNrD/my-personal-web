'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Gamepad2 } from 'lucide-react';

type Props = {
  banner: string;
  capsule: string;
  icon: string | null;
  name: string;
  width: number;
  height: number;
  className?: string;
};

export function SteamGameImage({ banner, capsule, icon, name, width, height, className }: Props) {
  const sources = [banner, capsule, ...(icon ? [icon] : [])];
  const [idx, setIdx] = useState(0);
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        className={`bg-muted text-muted-foreground/60 inline-flex items-center justify-center ${className ?? ''}`}
        aria-hidden
      >
        <Gamepad2 size={Math.min(width, height) * 0.45} />
      </span>
    );
  }

  return (
    <Image
      src={sources[idx]}
      alt={name}
      width={width}
      height={height}
      unoptimized
      className={className}
      onError={() => {
        if (idx < sources.length - 1) setIdx(idx + 1);
        else setFailed(true);
      }}
    />
  );
}
