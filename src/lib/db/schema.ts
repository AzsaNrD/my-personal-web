import {
  pgTable,
  serial,
  text,
  timestamp,
  index,
  integer,
  boolean,
  primaryKey,
} from 'drizzle-orm/pg-core';

export const guestbook = pgTable(
  'guestbook',
  {
    id: serial('id').primaryKey(),
    userId: text('user_id').notNull(),
    name: text('name').notNull(),
    avatar: text('avatar'),
    provider: text('provider').notNull(),
    message: text('message').notNull(),
    anonymous: boolean('anonymous').notNull().default(false),
    status: text('status', { enum: ['pending', 'approved'] })
      .notNull()
      .default('approved'),
    ipHash: text('ip_hash'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (table) => [
    index('guestbook_created_at_idx').on(table.createdAt.desc()),
    index('guestbook_ip_hash_idx').on(table.ipHash, table.createdAt),
  ],
);

export type Guestbook = typeof guestbook.$inferSelect;
export type NewGuestbook = typeof guestbook.$inferInsert;

export const views = pgTable('views', {
  slug: text('slug').primaryKey(),
  count: integer('count').notNull().default(0),
});

export type View = typeof views.$inferSelect;

/** One row per visitor per article per day, so a view can be counted once even if the endpoint is hit directly. */
export const viewHits = pgTable(
  'view_hits',
  {
    slug: text('slug').notNull(),
    visitor: text('visitor').notNull(),
    day: text('day').notNull(),
  },
  (table) => [primaryKey({ columns: [table.slug, table.visitor, table.day] })],
);
