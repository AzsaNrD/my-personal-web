'use client';

import { useState } from 'react';
import { Check, Share2 } from 'lucide-react';

type Props = {
  title: string;
  slug: string;
};

export function ShareButton({ title, slug }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    if (typeof window === 'undefined') return;
    const url = `${window.location.origin}/blog/${slug}`;
    const shareData = { title, url };

    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // user cancelled or unsupported, fall through to copy
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard blocked — silent
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={copied ? 'Link copied' : 'Share post'}
      className="text-muted-foreground hover:text-primary inline-flex items-center gap-1.5 font-mono text-xs transition-colors"
    >
      {copied ? <Check size={12} aria-hidden /> : <Share2 size={12} aria-hidden />}
      {copied ? 'link copied' : 'share'}
    </button>
  );
}
