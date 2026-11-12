'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import type { Payment } from '@/lib/data/payments';
import { PaymentIcon } from '@/components/ui/payment-icon';
import { cn } from '@/lib/utils';

const COPIED_MS = 1800;

/** The whole card is the copy button; a "Copied" pill fades in on the right, then fades out. */
export function PaymentCard({ p }: { p: Payment }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(p.identity);
    } catch {
      return; // Clipboard blocked; stay silent rather than claim a copy that did not happen.
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), COPIED_MS);
  };

  return (
    <li>
      <button
        type="button"
        onClick={handleCopy}
        className={cn(
          'hud-panel group flex w-full cursor-pointer items-center gap-3 p-3 text-left outline-none',
          'focus-visible:border-primary',
          copied && 'border-primary/70 bg-primary/5',
        )}
      >
        <PaymentIcon payment={p} />
        <span className="block min-w-0 flex-1">
          <span className="sr-only">Copy </span>
          <span className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
            <span className="text-foreground truncate text-sm font-medium">{p.name}</span>
            {p.fullName ? (
              <span className="text-muted-foreground truncate text-xs">{p.fullName}</span>
            ) : null}
          </span>
          {p.accountName ? (
            <span className="text-muted-foreground mt-0.5 block truncate text-xs">
              a/n {p.accountName}
            </span>
          ) : null}
          <span className="text-muted-foreground mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs">
            {p.identityLabel ? (
              <span className="text-muted-foreground shrink-0 font-mono tracking-wider uppercase">
                {p.identityLabel}
              </span>
            ) : null}
            <span className="text-foreground min-w-0 truncate font-mono">{p.identity}</span>
          </span>
          {p.note ? (
            <span className="text-muted-foreground mt-1 block text-xs leading-snug">{p.note}</span>
          ) : null}
        </span>

        <span
          aria-hidden
          className="relative flex h-6 w-[4.75rem] shrink-0 items-center justify-end"
        >
          <Copy
            size={15}
            className={cn(
              'text-muted-foreground/60 group-hover:text-primary transition-opacity duration-300',
              copied ? 'opacity-0' : 'opacity-100',
            )}
          />
          <span
            className={cn(
              'bg-primary/15 text-primary absolute right-0 inline-flex items-center gap-1 px-2 py-0.5 font-mono text-[10px] tracking-wider uppercase transition-opacity duration-300',
              copied ? 'opacity-100' : 'opacity-0',
            )}
          >
            <Check size={11} />
            Copied
          </span>
        </span>

        <span role="status" className="sr-only">
          {copied ? `${p.name} ${p.identityLabel ?? 'number'} copied to clipboard` : ''}
        </span>
      </button>
    </li>
  );
}
