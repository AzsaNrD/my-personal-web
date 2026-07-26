'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { SwitchTheme } from '@/components/ui/switch-theme';
import { Logo } from '@/components/ui/logo';
import { siteConfig } from '@/lib/site-config';
import { cn } from '@/lib/utils';

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname.startsWith(href);
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-background/70 supports-[backdrop-filter]:bg-background/50 border-border/60 sticky top-0 z-40 mb-4 w-full border-b backdrop-blur">
      <nav className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4 sm:px-6">
        <Link
          href="/"
          className="font-display inline-flex items-center gap-2.5 text-base font-bold tracking-tight"
          aria-label={`${siteConfig.shortName}, home`}
        >
          <Logo size={22} />
          <span>
            <span className="text-foreground">azsa</span>
            <span className="text-primary">-nrd</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm transition-colors',
                isActive(pathname, item.href)
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted',
              )}
            >
              {item.label}
            </Link>
          ))}
          <div className="ml-2">
            <SwitchTheme />
          </div>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <SwitchTheme />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              aria-label="Open menu"
              className="border-border bg-card text-muted-foreground hover:border-primary hover:text-primary inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-colors active:scale-95"
            >
              <Menu size={18} aria-hidden />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="font-display inline-flex items-center gap-2.5 text-base font-bold">
                  <Logo size={20} />
                  <span>
                    <span className="text-foreground">azsa</span>
                    <span className="text-primary">-nrd</span>
                  </span>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-1 px-4">
                {siteConfig.nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'rounded-md px-3 py-2 text-sm transition-colors',
                      isActive(pathname, item.href)
                        ? 'text-primary bg-primary/10'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
