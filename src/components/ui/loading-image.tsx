'use client';

import { useState } from 'react';
import Image, { type ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

/** Wraps next/image with a pulsing skeleton shown until the image finishes loading. */
export function LoadingImage({ className, onLoad, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <span className={cn('relative inline-block overflow-hidden', className)}>
      <span
        aria-hidden
        className={cn(
          'bg-muted absolute inset-0 animate-pulse transition-opacity duration-300',
          loaded ? 'opacity-0' : 'opacity-100',
        )}
      />
      <Image
        {...props}
        className={cn(
          'h-full w-full transition-opacity duration-300',
          className,
          loaded ? 'opacity-100' : 'opacity-0',
        )}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
      />
    </span>
  );
}
