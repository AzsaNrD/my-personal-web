'use client';

import { useRef, useState, type ComponentPropsWithoutRef } from 'react';
import { Check, Copy } from 'lucide-react';

export function CodeBlock({ children, ...props }: ComponentPropsWithoutRef<'pre'>) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const text = ref.current?.innerText ?? '';
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API can be blocked (insecure context, permissions). Silently no-op.
    }
  }

  return (
    <div className="group/code-block relative">
      <pre ref={ref} {...props}>
        {children}
      </pre>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? 'Copied' : 'Copy code'}
        className="border-border bg-card text-muted-foreground hover:border-primary hover:text-primary absolute top-2 right-2 inline-flex h-7 w-7 items-center justify-center rounded-md border opacity-0 transition group-hover/code-block:opacity-100 focus-visible:opacity-100 active:scale-95"
      >
        {copied ? <Check size={13} aria-hidden /> : <Copy size={13} aria-hidden />}
      </button>
    </div>
  );
}
