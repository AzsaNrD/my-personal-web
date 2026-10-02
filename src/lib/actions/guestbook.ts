'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import {
  approveGuestbookEntry,
  countPending,
  countRecentByIpHash,
  createGuestbookEntry,
  deleteGuestbookEntry,
  getGuestbookEntryById,
  getLastEntryAt,
} from '@/lib/db/guestbook';
import { ensureGuestKey, getGuestKey } from '@/lib/guestbook-guest';
import { getIpHash } from '@/lib/ip-hash';
import { isOwnerKey, userKey } from '@/lib/is-owner';

const MAX_LENGTH = 280;
const MIN_LENGTH = 1;
const MAX_NAME_LENGTH = 40;

const COOLDOWN_MS = 30_000;
const IP_WINDOW_MS = 60 * 60 * 1000;
const IP_MAX_PER_WINDOW = 5;
const MAX_PENDING_PER_GUEST = 3;
const MAX_PENDING_TOTAL = 100;

const LINK_PATTERN = /https?:\/\/|www\.|\w\.(com|net|org|io|xyz|ru|cn|top|info|link|site|me|co)\b/i;

type Typed = { message: string; name: string };

export type SubmitState =
  | { ok: true; pending: boolean }
  | { ok: false; error: string; typed?: Typed };

const fail = (error: string, typed?: Typed): SubmitState => ({ ok: false, error, typed });

export async function submitGuestbook(
  _prev: SubmitState | null,
  formData: FormData,
): Promise<SubmitState> {
  const session = await auth();
  const user = session?.user;
  const signedInKey = userKey(user?.provider, user?.providerAccountId);

  // Bots fill every field; a real visitor never sees this one.
  if (formData.get('website')) return { ok: true, pending: true };

  const raw = formData.get('message');
  if (typeof raw !== 'string') return fail('Invalid message.');
  const message = raw.trim();
  if (message.length < MIN_LENGTH) return fail('Message is empty.');
  if (message.length > MAX_LENGTH) return fail(`Message too long (max ${MAX_LENGTH} characters).`);

  // Handed back on failure so the form does not wipe what the visitor typed.
  const rawName = formData.get('name');
  const typed: Typed = { message: raw, name: typeof rawName === 'string' ? rawName : '' };

  if (signedInKey && user?.provider) {
    const last = await getLastEntryAt(signedInKey);
    if (last && Date.now() - last.getTime() < COOLDOWN_MS) {
      return fail('Too fast. Wait 30 seconds between messages.', typed);
    }
    await createGuestbookEntry({
      userId: signedInKey,
      name: user.name ?? 'unknown',
      avatar: user.image ?? null,
      provider: user.provider,
      message,
      anonymous: formData.get('anonymous') === 'on',
      status: 'approved',
    });
    revalidatePath('/guestbook');
    return { ok: true, pending: false };
  }

  if (LINK_PATTERN.test(message)) {
    return fail(
      'Links are not allowed in guest messages. Sign in if you need to share one.',
      typed,
    );
  }

  const name = typed.name.trim().slice(0, MAX_NAME_LENGTH) || 'Anonymous';

  const key = await ensureGuestKey();
  const last = await getLastEntryAt(key);
  if (last && Date.now() - last.getTime() < COOLDOWN_MS) {
    return fail('Too fast. Wait 30 seconds between messages.', typed);
  }
  if ((await countPending(key)) >= MAX_PENDING_PER_GUEST) {
    return fail(
      'You already have messages waiting for approval. Please wait for them first.',
      typed,
    );
  }
  if ((await countPending()) >= MAX_PENDING_TOTAL) {
    return fail('The guestbook queue is full right now. Please try again later.', typed);
  }

  const ipHash = await getIpHash();
  if (
    ipHash &&
    (await countRecentByIpHash(ipHash, new Date(Date.now() - IP_WINDOW_MS))) >= IP_MAX_PER_WINDOW
  ) {
    return fail('Too many messages from this network. Try again later.', typed);
  }

  await createGuestbookEntry({
    userId: key,
    name,
    avatar: null,
    provider: 'guest',
    message,
    anonymous: false,
    status: 'pending',
    ipHash,
  });
  revalidatePath('/guestbook');
  return { ok: true, pending: true };
}

async function requireOwner(): Promise<void> {
  const session = await auth();
  const key = userKey(session?.user?.provider, session?.user?.providerAccountId);
  if (!isOwnerKey(key)) throw new Error('Not authorized');
}

export async function approveGuestbookEntryAction(id: number): Promise<void> {
  await requireOwner();
  const entry = await getGuestbookEntryById(id);
  if (!entry) throw new Error('Entry not found');
  await approveGuestbookEntry(id);
  revalidatePath('/guestbook');
}

export async function deleteGuestbookEntryAction(id: number): Promise<void> {
  const session = await auth();
  const user = session?.user;
  const key = userKey(user?.provider, user?.providerAccountId) ?? (await getGuestKey());
  if (!key) throw new Error('Not authenticated');

  const entry = await getGuestbookEntryById(id);
  if (!entry) throw new Error('Entry not found');

  const isOwner = isOwnerKey(key);
  const isAuthor = entry.userId === key;
  if (!isOwner && !isAuthor) throw new Error('Not authorized');

  await deleteGuestbookEntry(id);
  revalidatePath('/guestbook');
}
