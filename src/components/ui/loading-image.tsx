'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import Image, { type ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

export function LoadingImage({ className, onLoad, ...props }: ImageProps) {
  // A priority image is the page's largest paint: show it as soon as the HTML arrives instead of
  // keeping it at opacity 0 until JavaScript has hydrated and flipped the flag.
  const [loaded, setLoaded] = useState(Boolean(props.priority));
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
