'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

export function GuestbookForm() {
  const [state, formAction] = useActionState<SubmitState | null, FormData>(submitGuestbook, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      <Textarea
        name="message"
        required
        minLength={1}
        maxLength={MAX_LENGTH}
        rows={3}
        placeholder="Write a public message here…"
        className="resize-none"
      />

      <label className="text-muted-foreground hover:text-foreground inline-flex cursor-pointer items-center gap-2 text-xs transition-colors">
        <input
          type="checkbox"
          name="anonymous"
          className="border-border text-primary focus:ring-primary h-3.5 w-3.5 rounded"
        />
        Post anonymously (your name won&apos;t be shown)
      </label>

      <div className="flex items-center justify-between gap-3">
        <p
          className={`text-xs ${state && !state.ok ? 'text-destructive' : 'text-muted-foreground'}`}
          role={state && !state.ok ? 'alert' : undefined}
        >
          {state?.ok
            ? 'Message sent. Thanks!'
            : state && !state.ok
              ? state.error
              : `Max ${MAX_LENGTH} characters. Message is public.`}
        </p>
        <SubmitButton />
      </div>
    </form>
  );
}
