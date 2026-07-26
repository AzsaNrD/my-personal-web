'use client';

import { useState } from 'react';
import Image from 'next/image';
import { UserRound } from 'lucide-react';

type Props = {
  src: string;
  alt: string;
  size: number;
  className?: string;
};

export function SteamAvatar({ src, alt, size, className }: Props) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        className={`bg-muted text-muted-foreground/60 inline-flex items-center justify-center ${className ?? ''}`}
        style={{ width: size, height: size }}
        aria-hidden
      >
        <UserRound size={size * 0.5} />
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      unoptimized
      priority
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
