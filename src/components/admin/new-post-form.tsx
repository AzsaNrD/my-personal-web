'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Tabs } from '@base-ui/react/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createPost, type CreatePostState } from '@/lib/actions/blog';
import { renderPostPreview, type PreviewState } from '@/lib/actions/preview';

const PREVIEW_DELAY_MS = 500;

const text = (data: FormData, name: string) => {
  const value = data.get(name);
  return typeof value === 'string' ? value : '';
};

const TAB_CLASS =
  'text-muted-foreground hover:text-foreground aria-selected:text-primary focus-visible:ring-ring/50 rounded-md px-3 py-1.5 font-mono text-[11px] tracking-wider uppercase transition-colors outline-none focus-visible:ring-3 aria-selected:bg-secondary/60';

function slugPreview(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
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

  const [tab, setTab] = useState<'write' | 'preview'>('write');
  const [edits, setEdits] = useState(0);
  const [preview, setPreview] = useState<PreviewState | null>(null);
  const [updating, setUpdating] = useState(false);
  const requestId = useRef(0);
  const lastKey = useRef('');
  const lastTab = useRef(tab);

  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
      setTitle('');
      setTab('write');
      setPreview(null);
      lastKey.current = '';
    }
  }, [state]);

  useEffect(() => {
    const form = formRef.current;
    if (tab !== 'preview' || !form) {
      lastTab.current = tab;
      return;
    }

    const data = new FormData(form);
    const input = {
      title: text(data, 'title'),
      description: text(data, 'description'),
      date: text(data, 'date'),
      content: text(data, 'content'),
    };
    const key = JSON.stringify(input);
    const justOpened = lastTab.current !== tab;
    lastTab.current = tab;
    if (key === lastKey.current) return;

    const timer = window.setTimeout(
      () => {
        if (!input.content.trim()) {
          lastKey.current = key;
          setPreview(null);
          return;
        }
        const id = ++requestId.current;
        setUpdating(true);
        renderPostPreview(input)
          .then((result) => {
            if (id !== requestId.current) return;
            lastKey.current = key;
            setPreview(result);
          })
          .catch(() => {
            if (id === requestId.current) {
              setPreview({ ok: false, error: 'Preview failed. Try again.' });
            }
          })
          .finally(() => {
            if (id === requestId.current) setUpdating(false);
          });
      },
      justOpened ? 0 : PREVIEW_DELAY_MS,
    );
    return () => window.clearTimeout(timer);
  }, [tab, edits]);

  return (
    <form
      ref={formRef}
      action={formAction}
      onInput={() => setEdits((n) => n + 1)}
      className="space-y-5"
    >
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
        <Tabs.Root value={tab} onValueChange={(value) => setTab(value as 'write' | 'preview')}>
          <Tabs.List className="mb-2 flex items-center gap-1" aria-label="Editor mode">
            <Tabs.Tab value="write" className={TAB_CLASS}>
              Write
            </Tabs.Tab>
            <Tabs.Tab value="preview" className={TAB_CLASS}>
              Preview
            </Tabs.Tab>
            <span
              role="status"
              aria-live="polite"
              className="text-muted-foreground ml-auto font-mono text-[10px] tracking-wider uppercase"
            >
              {tab === 'preview' && updating ? 'Updating…' : ''}
            </span>
          </Tabs.List>

          <Tabs.Panel value="write" keepMounted>
            <Textarea
              id="content"
              name="content"
              rows={16}
              className="font-mono text-sm [font-variant-ligatures:none]"
              placeholder="Write the post here…"
            />
          </Tabs.Panel>

          <Tabs.Panel value="preview">
            <div className="border-border rounded-lg border p-5">
              {!preview ? (
                <p className="text-muted-foreground text-sm">
                  {updating ? 'Rendering…' : 'Nothing to preview yet. Write something first.'}
                </p>
              ) : preview.ok ? (
                preview.node
              ) : (
                <p
                  role="alert"
                  className="text-destructive text-sm break-words whitespace-pre-wrap"
                >
                  {preview.error}
                </p>
              )}
            </div>
          </Tabs.Panel>
        </Tabs.Root>
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
