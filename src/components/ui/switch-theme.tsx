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
    <div className='transition-opacity duration-300 ease-in-out'>
      {resolvedTheme === 'dark' ? (
        <Sun03Icon className='cursor-pointer' size={20} onClick={() => setTheme('light')} />
      ) : (
        <Moon02Icon className='cursor-pointer' size={20} onClick={() => setTheme('dark')} />
      )}
    </div>
  );
}
