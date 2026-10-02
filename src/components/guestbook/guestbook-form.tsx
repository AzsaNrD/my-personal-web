'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
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

  const hint = guest
    ? `Max ${MAX_LENGTH} characters. A guest message is reviewed before it appears publicly, and you can see yours right away.`
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
    </form>
  );
}
