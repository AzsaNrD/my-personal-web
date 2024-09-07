'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun03Icon, Moon02Icon } from 'hugeicons-react';

export function SwitchTheme() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      className='cursor-pointer ease-in-out bg-light-shape dark:bg-dark-shape rounded-lg active:scale-95 transition-all duration-200'
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      {resolvedTheme === 'dark' ? (
        <Sun03Icon className='m-2 text-light-text dark:text-dark-text' size={18} />
      ) : (
        <Moon02Icon className='m-2 text-light-text dark:text-dark-text' size={18} />
      )}
    </button>
  );
}
