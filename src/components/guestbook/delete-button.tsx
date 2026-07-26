'use client';

import { useState, useTransition } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { deleteGuestbookEntryAction } from '@/lib/actions/guestbook';

type Props = {
  id: number;
  preview: string;
};

export function DeleteButton({ id, preview }: Props) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const snippet = preview.length > 120 ? `${preview.slice(0, 120)}…` : preview;

  function handleConfirm() {
    setError(null);
    startTransition(async () => {
      try {
        await deleteGuestbookEntryAction(id);
        setOpen(false);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to delete.');
      }
    });
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        type="button"
        aria-label="Delete message"
        className="text-muted-foreground hover:text-destructive inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors disabled:opacity-50"
      >
        <Trash2 size={13} aria-hidden />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/40 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-xs" />
        <Dialog.Popup className="bg-card text-card-foreground border-border fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border p-5 shadow-xl transition duration-150 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
          <Dialog.Title className="text-foreground text-base font-semibold">
            Delete this message?
          </Dialog.Title>
          <Dialog.Description className="text-muted-foreground mt-1 text-sm">
            This action can&apos;t be undone.
          </Dialog.Description>
          <blockquote className="border-border bg-muted/40 text-muted-foreground mt-4 rounded-md border-l-2 p-3 text-sm break-words whitespace-pre-wrap">
            {snippet}
          </blockquote>
          {error && <p className="text-destructive mt-3 text-xs">{error}</p>}
          <div className="mt-5 flex justify-end gap-2">
            <Dialog.Close
              render={
                <Button variant="outline" size="sm" disabled={pending}>
                  Cancel
                </Button>
              }
            />
            <Button variant="destructive" size="sm" onClick={handleConfirm} disabled={pending}>
              {pending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
