import { eq, sql } from 'drizzle-orm';
import { getDb } from './index';
import { views } from './schema';

export async function getViews(slug: string): Promise<number> {
  const rows = await getDb().select({ count: views.count }).from(views).where(eq(views.slug, slug));
  return rows[0]?.count ?? 0;
}

export async function incrementView(slug: string): Promise<number> {
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
