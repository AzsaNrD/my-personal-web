'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { UserRound } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  src: string;
  alt: string;
  size: number;
  className?: string;
};

export function SteamAvatar({ src, alt, size, className }: Props) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

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
    <span className={cn('relative inline-block overflow-hidden', className)}>
      {!loaded && <span aria-hidden className="bg-muted absolute inset-0 animate-pulse" />}
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        unoptimized
        priority
        ref={imgRef}
        className={cn(
          'h-full w-full transition-opacity duration-300',
          className,
          loaded ? 'opacity-100' : 'opacity-0',
        )}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </span>
  );
}
