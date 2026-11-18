'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { CheckCircle2, Clock, LoaderCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { submitGuestbook, type SubmitState } from '@/lib/actions/guestbook';

const MAX_LENGTH = 280;
const WARN_AT = 40;
const DRAFT_KEY = 'guestbook:draft';

type Draft = { message: string; name: string };

function readDraft(): Draft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as Draft) : null;
  } catch {
    return null;
  }
}

function writeDraft(draft: Draft) {
  try {
    if (!draft.message && !draft.name) localStorage.removeItem(DRAFT_KEY);
    else localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // Private mode or blocked storage: the draft just is not kept.
  }
}

/** Ring that fills as the message grows. Only near the limit is it announced to screen readers. */
function CharCounter({ length }: { length: number }) {
  const remaining = MAX_LENGTH - length;
  const radius = 8;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(length / MAX_LENGTH, 1);
  const tone =
    remaining <= 0 ? 'text-destructive' : remaining <= WARN_AT ? 'text-amber-500' : 'text-primary';

  return (
    <span className="text-muted-foreground flex items-center gap-1.5 font-mono text-xs tabular-nums">
      <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden className={tone}>
        <circle
          cx="10"
          cy="10"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.2"
          strokeWidth="2"
        />
        <circle
          cx="10"
          cy="10"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          transform="rotate(-90 10 10)"
          className="transition-[stroke-dashoffset] duration-150"
        />
      </svg>
      <span aria-hidden className={remaining <= WARN_AT ? tone : undefined}>
        {length}/{MAX_LENGTH}
      </span>
      {remaining <= 20 ? (
        <span role="status" className="sr-only">
          {remaining >= 0 ? `${remaining} characters left` : `${-remaining} characters over`}
        </span>
      ) : null}
    </span>
  );
}

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending || disabled} className="h-11 w-full sm:h-10">
      {pending ? (
        <LoaderCircle size={14} className="animate-spin" aria-hidden />
      ) : (
        <Send size={14} aria-hidden />
      )}
      {pending ? 'Sending…' : 'Send'}
      <kbd
        aria-hidden
        className="bg-primary-foreground/15 ml-1 hidden rounded px-1.5 py-0.5 font-mono text-[11px] font-normal lg:inline"
      >
        Ctrl ↵
      </kbd>
    </Button>
  );
}

function Notice({ pending }: { pending: boolean }) {
  const Icon = pending ? Clock : CheckCircle2;
  return (
    <div
      role="status"
      className="border-primary/30 bg-primary/5 flex animate-[rise-in_0.35s_ease-out_both] items-start gap-3 border p-3"
    >
      <Icon size={16} className="text-primary mt-0.5 shrink-0" aria-hidden />
      <div className="min-w-0 text-sm">
        <p className="text-foreground font-medium">
          {pending ? 'Message received' : 'Message sent. Thanks!'}
        </p>
        {pending ? (
          <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">
            Guest messages are reviewed first. Yours appears publicly once approved. Until then only
            you can see it below.
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function GuestbookForm({ guest }: { guest: boolean }) {
  const [state, formAction] = useActionState<SubmitState | null, FormData>(submitGuestbook, null);
  const typed = state && !state.ok ? state.typed : undefined;
  const [dismissed, setDismissed] = useState<SubmitState | null>(null);
  const [length, setLength] = useState(0);
  const [filled, setFilled] = useState(false);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  const showNotice = state?.ok === true && dismissed !== state;
  const hint = guest
    ? 'Guest messages are reviewed before they show up.'
    : 'Your message is public once sent.';

  // Bring back a draft left behind by a reload or a sign-in redirect.
  useEffect(() => {
    const draft = readDraft();
    if (!draft) return;
    const message = messageRef.current;
    if (message && !message.value && draft.message) {
      message.value = draft.message;
      setLength(draft.message.length);
      setFilled(draft.message.trim().length > 0);
    }
    const name = nameRef.current;
    if (name && !name.value && draft.name) name.value = draft.name;
  }, []);

  // A sent message clears the draft; a rejected one hands the text back, so re-sync the counter.
  useEffect(() => {
    if (!state) return;
    if (state.ok) {
      writeDraft({ message: '', name: nameRef.current?.value ?? '' });
      setLength(0);
      setFilled(false);
    } else if (state.typed) {
      setLength(state.typed.message.length);
      setFilled(state.typed.message.trim().length > 0);
    }
  }, [state]);

  function handleInput() {
    const value = messageRef.current?.value ?? '';
    setLength(value.length);
    setFilled(value.trim().length > 0);
    writeDraft({
      message: messageRef.current?.value ?? '',
      name: nameRef.current?.value ?? '',
    });
    if (state?.ok) setDismissed(state);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <form action={formAction} onInput={handleInput} className="space-y-3">
      {guest && (
        <>
          <Input
            ref={nameRef}
            name="name"
            defaultValue={typed?.name}
            maxLength={40}
            className="h-11 sm:h-8"
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

      <div className="relative">
        <Textarea
          ref={messageRef}
          name="message"
          defaultValue={typed?.message}
          required
          minLength={1}
          maxLength={MAX_LENGTH}
          rows={3}
          placeholder="Write a message here…"
          aria-label="Message"
          aria-keyshortcuts="Control+Enter Meta+Enter"
          onKeyDown={handleKeyDown}
          className="max-h-60 resize-none pb-8"
        />
        <div className="pointer-events-none absolute right-2.5 bottom-2">
          <CharCounter length={length} />
        </div>
      </div>

      {!guest && (
        <label className="text-muted-foreground hover:text-foreground inline-flex cursor-pointer items-center gap-2 py-1.5 text-xs transition-colors">
          <input
            type="checkbox"
            name="anonymous"
            className="border-border text-primary focus:ring-primary h-4 w-4 rounded sm:h-3.5 sm:w-3.5"
          />
          Post anonymously (your name won&apos;t be shown)
        </label>
      )}

      <p
        className={`text-xs ${state && !state.ok ? 'text-destructive' : 'text-muted-foreground'}`}
        role={state && !state.ok ? 'alert' : undefined}
      >
        {state && !state.ok ? state.error : hint}
      </p>

      <SubmitButton disabled={!filled} />

      {showNotice && state?.ok ? <Notice pending={state.pending} /> : null}
    </form>
  );
}
