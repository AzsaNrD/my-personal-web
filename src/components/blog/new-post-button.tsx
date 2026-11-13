'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Owner-only shortcut. Resolved on the client so the blog index itself stays static
 * (no session lookup blocking the page, no loading skeleton swap).
 */
export function NewPostButton() {
  const [owner, setOwner] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/owner')
      .then((res) => res.json() as Promise<{ owner: boolean }>)
      .then((data) => {
        if (!cancelled) setOwner(data.owner);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (!owner) return null;

  return (
    <Button
      size="default"
      className="h-9 animate-[page-fade_0.3s_ease-out_both] gap-1.5 px-3 text-sm"
      nativeButton={false}
      render={<Link href="/admin/new-post" />}
    >
      <Plus size={15} aria-hidden />
      New post
    </Button>
  );
}
