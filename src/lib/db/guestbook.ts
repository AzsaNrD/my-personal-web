import { and, desc, eq, isNull } from 'drizzle-orm';
import { getDb } from './index';
import { guestbook, type Guestbook, type NewGuestbook } from './schema';

export async function getGuestbookEntries(limit = 100): Promise<Guestbook[]> {
  return getDb()
    .select()
    .from(guestbook)
    .where(isNull(guestbook.deletedAt))
    .orderBy(desc(guestbook.createdAt))
    .limit(limit);
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
