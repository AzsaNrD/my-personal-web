'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createPost, type CreatePostState } from '@/lib/actions/blog';

function slugPreview(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="text-muted-foreground mb-1.5 block font-mono text-[11px] tracking-wider uppercase"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="h-10 px-4 text-sm font-semibold" disabled={pending}>
      {pending ? 'Publishing…' : 'Publish'}
    </Button>
  );
}

export function NewPostForm() {
  const [state, formAction] = useActionState<CreatePostState | null, FormData>(createPost, null);
  const [title, setTitle] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
      setTitle('');
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      <Field id="title" label="Title">
        <Input
          id="title"
          name="title"
          required
          maxLength={120}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Field>

      <Field id="slug" label="Slug (optional, derived from title otherwise)">
        <Input id="slug" name="slug" placeholder={slugPreview(title) || 'my-post-slug'} />
      </Field>

      <Field id="description" label="Description">
        <Input id="description" name="description" maxLength={300} />
      </Field>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field id="date" label="Date">
          <Input id="date" name="date" type="date" defaultValue={today} />
        </Field>
        <Field id="tags" label="Tags (comma separated)">
          <Input id="tags" name="tags" placeholder="intro, meta" />
        </Field>
      </div>

      <Field id="content" label="Content (Markdown / MDX)">
        <Textarea
          id="content"
          name="content"
          required
          rows={16}
          className="font-mono text-sm"
          placeholder="Write the post here…"
        />
      </Field>

      <label className="text-muted-foreground inline-flex cursor-pointer items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="draft"
          defaultChecked
          className="border-border text-primary focus:ring-primary h-3.5 w-3.5 rounded"
        />
        Save as draft (hidden from the live site until you edit the file and flip this off)
      </label>

      <div className="flex items-center justify-between gap-3">
        <p
          className={`text-xs ${state && !state.ok ? 'text-destructive' : 'text-muted-foreground'}`}
          role={state && !state.ok ? 'alert' : undefined}
        >
          {state?.ok
            ? `Committed as "${state.slug}". It'll be live in a minute or two once the deploy finishes.`
            : state && !state.ok
              ? state.error
              : 'Commits directly to the repo on submit.'}
        </p>
        <SubmitButton />
      </div>
    </form>
  );
}
