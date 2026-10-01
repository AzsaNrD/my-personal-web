'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import Image, { type ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

export function LoadingImage({ className, onLoad, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // A cached image can finish before onLoad attaches, leaving the skeleton stuck on.
  useLayoutEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  return (
    <span className={cn('relative inline-block overflow-hidden', className)}>
      {!loaded && <span aria-hidden className={cn('bg-muted absolute inset-0 animate-pulse')} />}
      <Image
        {...props}
        ref={imgRef}
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
