'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import {
  createGuestbookEntry,
  deleteGuestbookEntry,
  getGuestbookEntryById,
} from '@/lib/db/guestbook';
import { isOwnerKey, userKey } from '@/lib/is-owner';

const MAX_LENGTH = 280;
const MIN_LENGTH = 1;

export type SubmitState = { ok: true } | { ok: false; error: string };

const lastPostByUser = new Map<string, number>();
const COOLDOWN_MS = 30_000;

export async function submitGuestbook(
  _prev: SubmitState | null,
  formData: FormData,
): Promise<SubmitState> {
  const session = await auth();
  const user = session?.user;

  if (!user || !user.providerAccountId || !user.provider) {
    return { ok: false, error: 'Please sign in first.' };
  }

  const key = userKey(user.provider, user.providerAccountId)!;
  const last = lastPostByUser.get(key);
  if (last && Date.now() - last < COOLDOWN_MS) {
    return { ok: false, error: 'Too fast. Wait 30 seconds between messages.' };
  }

  const raw = formData.get('message');
  if (typeof raw !== 'string') {
    return { ok: false, error: 'Invalid message.' };
  }
  const message = raw.trim();
  if (message.length < MIN_LENGTH) {
    return { ok: false, error: 'Message is empty.' };
  }
  if (message.length > MAX_LENGTH) {
    return { ok: false, error: `Message too long (max ${MAX_LENGTH} characters).` };
  }

  const anonymous = formData.get('anonymous') === 'on';

  await createGuestbookEntry({
    userId: key,
    name: user.name ?? 'unknown',
    avatar: user.image ?? null,
    provider: user.provider,
    message,
    anonymous,
  });

  lastPostByUser.set(key, Date.now());
  revalidatePath('/guestbook');
  return { ok: true };
}

export async function deleteGuestbookEntryAction(id: number): Promise<void> {
  const session = await auth();
  const user = session?.user;

  if (!user?.provider || !user?.providerAccountId) {
    throw new Error('Not authenticated');
  }

  const key = userKey(user.provider, user.providerAccountId);
  const entry = await getGuestbookEntryById(id);
  if (!entry) {
    throw new Error('Entry not found');
  }

  const isOwner = isOwnerKey(key);
  const isAuthor = entry.userId === key;
  if (!isOwner && !isAuthor) {
    throw new Error('Not authorized');
  }

  await deleteGuestbookEntry(id);
  revalidatePath('/guestbook');
}
