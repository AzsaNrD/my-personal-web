import { eq, lt, sql } from 'drizzle-orm';
import { getDb } from './index';
import { viewHits, views } from './schema';

const CLEANUP_CHANCE = 0.02;
const DAY_MS = 24 * 60 * 60 * 1000;

const isoDay = (ms: number) => new Date(ms).toISOString().slice(0, 10);

export async function getViews(slug: string): Promise<number> {
  const rows = await getDb().select({ count: views.count }).from(views).where(eq(views.slug, slug));
  return rows[0]?.count ?? 0;
}

async function incrementView(slug: string): Promise<number> {
  const [row] = await getDb()
    .insert(views)
    .values({ slug, count: 1 })
    .onConflictDoUpdate({
      target: views.slug,
      set: { count: sql`${views.count} + 1` },
    })
    .returning({ count: views.count });
  return row?.count ?? 0;
}

/** Counts a view once per visitor per article per day; repeat calls just return the current total. */
export async function recordView(slug: string, visitor: string): Promise<number> {
  const db = getDb();
  const inserted = await db
    .insert(viewHits)
    .values({ slug, visitor, day: isoDay(Date.now()) })
    .onConflictDoNothing()
    .returning({ slug: viewHits.slug });

  if (inserted.length === 0) return getViews(slug);

  if (Math.random() < CLEANUP_CHANCE) {
    await db.delete(viewHits).where(lt(viewHits.day, isoDay(Date.now() - DAY_MS)));
  }
  return incrementView(slug);
}
