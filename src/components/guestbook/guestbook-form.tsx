'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Dialog } from '@base-ui/react/dialog';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { submitGuestbook, type SubmitState } from '@/lib/actions/guestbook';

const MAX_LENGTH = 280;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending}>
      <Send size={14} />
      {pending ? 'Sending…' : 'Send'}
    </Button>
  );
}

export function GuestbookForm({ guest }: { guest: boolean }) {
  const [state, formAction] = useActionState<SubmitState | null, FormData>(submitGuestbook, null);
  const typed = state && !state.ok ? state.typed : undefined;
  const [dismissed, setDismissed] = useState<SubmitState | null>(null);
  const noticeOpen = state?.ok === true && state.pending && dismissed !== state;

  const hint = guest
    ? `Max ${MAX_LENGTH} characters.`
    : `Max ${MAX_LENGTH} characters. Message is public.`;

  return (
    <form action={formAction} className="space-y-3">
      {guest && (
        <>
          <Input
            name="name"
            defaultValue={typed?.name}
            maxLength={40}
            autoComplete="nickname"
            placeholder="Your name (optional)"
            aria-label="Your name (optional)"
          />
          <div aria-hidden className="absolute -left-[9999px]">
            <label>
              Website
              <input type="text" name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
        </>
      )}

      <Textarea
        name="message"
        defaultValue={typed?.message}
        required
        minLength={1}
        maxLength={MAX_LENGTH}
        rows={3}
        placeholder="Write a message here…"
        aria-label="Message"
        className="resize-none"
      />

      {!guest && (
        <label className="text-muted-foreground hover:text-foreground inline-flex cursor-pointer items-center gap-2 text-xs transition-colors">
          <input
            type="checkbox"
            name="anonymous"
            className="border-border text-primary focus:ring-primary h-3.5 w-3.5 rounded"
          />
          Post anonymously (your name won&apos;t be shown)
        </label>
      )}

      <div className="flex items-center justify-between gap-3">
        <p
          className={`text-xs ${state && !state.ok ? 'text-destructive' : 'text-muted-foreground'}`}
          role={state && !state.ok ? 'alert' : undefined}
        >
          {state?.ok
            ? state.pending
              ? 'Thanks! Your message is waiting for approval. Only you can see it until then.'
              : 'Message sent. Thanks!'
            : state && !state.ok
              ? state.error
              : hint}
        </p>
        <SubmitButton />
      </div>

      <Dialog.Root open={noticeOpen} onOpenChange={(open) => !open && setDismissed(state)}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/40 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-xs" />
          <Dialog.Popup className="bg-card text-card-foreground border-border fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border p-5 shadow-xl transition duration-150 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
            <Dialog.Title className="text-foreground text-base font-semibold">
              Message received
            </Dialog.Title>
            <Dialog.Description className="text-muted-foreground mt-1 text-sm">
              Thanks for writing! Guest messages are reviewed first, so yours will appear publicly
              once it&apos;s approved. Until then only you can see it on this page.
            </Dialog.Description>
            <div className="mt-5 flex justify-end">
              <Dialog.Close render={<Button size="sm">Got it</Button>} />
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </form>
  );
}
