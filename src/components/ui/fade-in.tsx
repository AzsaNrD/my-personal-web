'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type FadeInProps = React.ComponentProps<'div'> & { delay?: number };

/** Fades and lifts into view once, the first time it scrolls into the viewport. */
export function FadeIn({ delay = 0, className, style, children, ...props }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -80px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn('fade-in', shown && 'fade-in-shown', className)}
      style={{ transitionDelay: delay ? `${delay}s` : undefined, ...style }}
      {...props}
    >
      {children}
    </div>
  );
}
