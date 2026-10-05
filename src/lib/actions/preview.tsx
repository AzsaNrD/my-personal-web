'use server';

import type { ReactNode } from 'react';
import { compileMDX } from 'next-mdx-remote/rsc';
import { auth } from '@/lib/auth';
import { isOwnerKey, userKey } from '@/lib/is-owner';
import { estimateReadingMinutes } from '@/lib/mdx';
import { mdxOptions } from '@/lib/mdx/options';
import { mdxComponents } from '@/components/blog/mdx-components';
import { PostHeader, PostProse } from '@/components/blog/post-layout';

const MAX_CONTENT = 200_000;

export type PreviewInput = {
  title: string;
  description: string;
  date: string;
  content: string;
  lang: 'id' | 'en';
};
export type PreviewState = { ok: true; node: ReactNode } | { ok: false; error: string };

const isValidDate = (value: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));

/** Renders a draft with the exact pipeline the blog uses. MDX is code, so this must stay owner-only. */
export async function renderPostPreview(input: PreviewInput): Promise<PreviewState> {
  const session = await auth();
  const key = userKey(session?.user?.provider, session?.user?.providerAccountId);
  if (!isOwnerKey(key)) return { ok: false, error: 'Not authorized.' };

  const { title, description, date, content } = input;
  const lang = input.lang === 'en' ? 'en' : 'id';
  if (![title, description, date, content].every((v) => typeof v === 'string')) {
    return { ok: false, error: 'Invalid preview request.' };
  }
  if (content.length > MAX_CONTENT) return { ok: false, error: 'Content is too long.' };

  try {
    const { content: body } = await compileMDX({
      source: content.trim(),
      options: mdxOptions,
      components: mdxComponents,
    });
    return {
      ok: true,
      node: (
        <>
          <PostHeader
            title={title.trim() || 'Untitled'}
            description={description.trim()}
            date={isValidDate(date) ? date : new Date().toISOString().slice(0, 10)}
            readingMinutes={estimateReadingMinutes(content)}
            lang={lang}
          />
          <PostProse lang={lang}>{body}</PostProse>
        </>
      ),
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Could not render this MDX.',
    };
  }
}
