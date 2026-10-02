'use client';

import { useState, useTransition } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { approveGuestbookEntryAction } from '@/lib/actions/guestbook';

export function ApproveButton({ id }: { id: number }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleApprove() {
    setError(null);
    startTransition(async () => {
      try {
        await approveGuestbookEntryAction(id);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to approve.');
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button type="button" variant="outline" size="sm" onClick={handleApprove} disabled={pending}>
        <Check size={13} aria-hidden />
        {pending ? 'Approving…' : 'Approve'}
      </Button>
      {error && (
        <p role="alert" className="text-destructive text-xs">
          {error}
        </p>
      )}
    </div>
  );
}
