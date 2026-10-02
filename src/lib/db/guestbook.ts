import { and, count, desc, eq, gt, isNull } from 'drizzle-orm';
import { getDb } from './index';
import { guestbook, type Guestbook, type NewGuestbook } from './schema';

export async function getGuestbookEntries(limit = 100): Promise<Guestbook[]> {
  return getDb()
    .select()
    .from(guestbook)
    .where(and(isNull(guestbook.deletedAt), eq(guestbook.status, 'approved')))
    .orderBy(desc(guestbook.createdAt))
    .limit(limit);
}

/** Pending entries for the owner (no userId) or for one guest (their own key). */
export async function getPendingEntries(userId?: string): Promise<Guestbook[]> {
  const conditions = [isNull(guestbook.deletedAt), eq(guestbook.status, 'pending')];
  if (userId) conditions.push(eq(guestbook.userId, userId));
  return getDb()
    .select()
    .from(guestbook)
    .where(and(...conditions))
    .orderBy(desc(guestbook.createdAt))
    .limit(100);
}

export async function getGuestbookEntryById(id: number): Promise<Guestbook | null> {
  const [row] = await getDb()
    .select()
    .from(guestbook)
    .where(and(eq(guestbook.id, id), isNull(guestbook.deletedAt)))
    .limit(1);
  return row ?? null;
}

export async function createGuestbookEntry(entry: NewGuestbook): Promise<Guestbook> {
  const [row] = await getDb().insert(guestbook).values(entry).returning();
  return row;
}

export async function deleteGuestbookEntry(id: number): Promise<void> {
  await getDb().update(guestbook).set({ deletedAt: new Date() }).where(eq(guestbook.id, id));
}

export async function approveGuestbookEntry(id: number): Promise<void> {
  await getDb().update(guestbook).set({ status: 'approved' }).where(eq(guestbook.id, id));
}

export async function getLastEntryAt(userId: string): Promise<Date | null> {
  const [row] = await getDb()
    .select({ createdAt: guestbook.createdAt })
    .from(guestbook)
    .where(eq(guestbook.userId, userId))
    .orderBy(desc(guestbook.createdAt))
    .limit(1);
  return row?.createdAt ?? null;
}

export async function countRecentByIpHash(ipHash: string, since: Date): Promise<number> {
  const [row] = await getDb()
    .select({ n: count() })
    .from(guestbook)
    .where(and(eq(guestbook.ipHash, ipHash), gt(guestbook.createdAt, since)));
  return row?.n ?? 0;
}

export async function countPending(userId?: string): Promise<number> {
  const conditions = [isNull(guestbook.deletedAt), eq(guestbook.status, 'pending')];
  if (userId) conditions.push(eq(guestbook.userId, userId));
  const [row] = await getDb()
    .select({ n: count() })
    .from(guestbook)
    .where(and(...conditions));
  return row?.n ?? 0;
}
