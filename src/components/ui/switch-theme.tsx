'use client';

import { useTheme } from '@/components/theme/theme-provider';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export function SwitchTheme() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      aria-label={mounted ? `Switch to ${isDark ? 'light' : 'dark'} theme` : 'Switch theme'}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="border-border bg-card text-muted-foreground hover:border-primary hover:text-primary inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-colors duration-200 active:scale-95"
    >
      {mounted ? (
        isDark ? (
          <Sun size={18} aria-hidden />
        ) : (
          <Moon size={18} aria-hidden />
        )
      ) : (
        <span className="block h-[18px] w-[18px]" aria-hidden />
      )}
    </button>
  );
}
