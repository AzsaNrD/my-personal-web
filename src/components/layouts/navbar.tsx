'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { SwitchTheme } from '@/components/ui/switch-theme';
import { ScrollProgress } from '@/components/ui/scroll-progress';
import { containerWidth, useSection } from '@/components/layouts/site-container';
import { siteConfig } from '@/lib/site-config';
import { cn } from '@/lib/utils';

function isActive(section: string, href: string) {
  return href === '/' ? section === '' : href === `/${section}`;
}

function Wordmark() {
  return (
    <>
      <span className="text-primary/70 font-mono text-sm" aria-hidden>
        &gt;_
      </span>
      <span className="text-foreground">azsa</span>
      <span className="text-primary">-nrd</span>
    </>
  );
}

export function Navbar() {
  const section = useSection();
  const [open, setOpen] = useState(false);

  return (
    <header className="glass-bar sticky top-0 z-40 mb-4 w-full">
      <nav
        className={cn(
          'mx-auto flex items-center justify-between px-5 py-3.5 sm:px-6',
          containerWidth(section),
        )}
      >
        <Link
          href="/"
          className="font-display -my-2.5 flex items-center gap-1.5 py-2.5 text-base font-bold tracking-tight"
          aria-label={`${siteConfig.shortName}, home`}
        >
          <Wordmark />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          <span
            className="text-muted-foreground/70 mr-3 hidden items-center gap-2 font-mono text-[11px] tracking-[0.22em] uppercase lg:inline-flex"
            aria-hidden
          >
            <span className="bg-primary ping-dot relative size-1.5 rounded-full" />
            sys.online
          </span>
          {siteConfig.nav.map((item, idx) => {
            const active = isActive(section, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'group relative px-3 py-1.5 font-mono text-xs tracking-[0.14em] uppercase transition-colors',
                  active ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <span
                  className={cn(
                    'mr-1.5 transition-colors',
                    active ? 'text-primary/70' : 'text-muted-foreground/40',
                  )}
                  aria-hidden
                >
                  {String(idx + 1).padStart(2, '0')}
                </span>
                {item.label}
                <span
                  aria-hidden
                  className={cn(
                    'bg-primary absolute inset-x-3 -bottom-px h-px origin-left shadow-[0_0_8px_var(--glow-strong)] transition-transform duration-300',
                    active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                  )}
                />
              </Link>
            );
          })}
          <div className="ml-3">
            <SwitchTheme />
          </div>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <SwitchTheme />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              aria-label="Open menu"
              className="border-border bg-card text-muted-foreground hover:border-primary hover:text-primary inline-flex h-11 w-11 items-center justify-center rounded-lg border transition-colors active:scale-95 md:h-9 md:w-9"
            >
              <Menu size={18} aria-hidden />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="font-display flex items-center gap-1.5 text-base font-bold">
                  <Wordmark />
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-1 px-4">
                {siteConfig.nav.map((item, idx) => {
                  const active = isActive(section, item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'border-l-2 px-3 py-2.5 font-mono text-sm tracking-[0.14em] uppercase transition-colors',
                        active
                          ? 'border-primary text-primary bg-primary/10'
                          : 'text-muted-foreground hover:text-foreground hover:border-primary/50 border-transparent',
                      )}
                    >
                      <span className="text-muted-foreground/50 mr-2" aria-hidden>
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
      <ScrollProgress />
    </header>
  );
}
