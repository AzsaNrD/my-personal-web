'use server';

import matter from 'gray-matter';
import { auth } from '@/lib/auth';
import { isOwnerKey, userKey } from '@/lib/is-owner';
import { createRepoFile, repoFileExists } from '@/lib/github-content';

const POSTS_DIR = 'src/content/posts';

const MAX_TITLE = 120;
const MAX_DESCRIPTION = 300;
const MAX_CONTENT = 200_000;
const MAX_TAGS = 8;
const MAX_TAG_LENGTH = 30;
const COOLDOWN_MS = 10_000;

export type CreatePostState = { ok: true; slug: string } | { ok: false; error: string };

const lastSubmitByUser = new Map<string, number>();

/**
 * Reduces input to [a-z0-9-] only. This is the sole guard against path
 * traversal: whatever the caller types, the result can never contain `/`,
 * `..`, or any character outside that set, so it cannot escape POSTS_DIR.
 */
function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function isValidDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));
}

export async function createPost(
  _prev: CreatePostState | null,
  formData: FormData,
): Promise<CreatePostState> {
  const session = await auth();
  const user = session?.user;
  if (!user?.provider || !user?.providerAccountId) {
    return { ok: false, error: 'Not signed in.' };
  }

  const key = userKey(user.provider, user.providerAccountId);
  if (!isOwnerKey(key)) {
    return { ok: false, error: 'Not authorized.' };
  }

  const last = lastSubmitByUser.get(key!);
  if (last && Date.now() - last < COOLDOWN_MS) {
    return { ok: false, error: 'Too fast. Wait a few seconds and try again.' };
  }

  const rawTitle = formData.get('title');
  const rawContent = formData.get('content');
  if (typeof rawTitle !== 'string' || typeof rawContent !== 'string') {
    return { ok: false, error: 'Invalid form submission.' };
  }

  const title = rawTitle.trim();
  const content = rawContent.trim();
  const rawDescription = formData.get('description');
  const description = typeof rawDescription === 'string' ? rawDescription.trim() : '';
  const rawDate = formData.get('date');
  const date =
    typeof rawDate === 'string' && isValidDate(rawDate)
      ? rawDate
      : new Date().toISOString().slice(0, 10);
  const rawTags = formData.get('tags');
  const tags =
    typeof rawTags === 'string'
      ? rawTags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
          .slice(0, MAX_TAGS)
          .map((t) => t.slice(0, MAX_TAG_LENGTH))
      : [];
  const draft = formData.get('draft') === 'on';

  if (title.length < 1 || title.length > MAX_TITLE) {
    return { ok: false, error: `Title must be 1-${MAX_TITLE} characters.` };
  }
  if (description.length > MAX_DESCRIPTION) {
    return { ok: false, error: `Description must be under ${MAX_DESCRIPTION} characters.` };
  }
  if (content.length < 1) {
    return { ok: false, error: 'Content is empty.' };
  }
  if (content.length > MAX_CONTENT) {
    return { ok: false, error: 'Content is too long.' };
  }

  const rawSlug = formData.get('slug');
  const slug = slugify(typeof rawSlug === 'string' && rawSlug.trim() ? rawSlug : title);
  if (!slug) {
    return { ok: false, error: 'Could not derive a valid slug from the title.' };
  }

  const path = `${POSTS_DIR}/${slug}.mdx`;

  let exists: boolean;
  try {
    exists = await repoFileExists(path);
  } catch {
    return { ok: false, error: 'Could not reach GitHub. Try again in a moment.' };
  }
  if (exists) {
    return { ok: false, error: `A post with the slug "${slug}" already exists.` };
  }

  const file = matter.stringify(`\n${content}\n`, { title, description, date, tags, draft });

  try {
    await createRepoFile(path, file, `feat(blog): add post "${title}"`);
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Failed to publish.' };
  }

  lastSubmitByUser.set(key!, Date.now());
  return { ok: true, slug };
}
