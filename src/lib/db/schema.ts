import { pgTable, serial, text, timestamp, index, integer, boolean } from 'drizzle-orm/pg-core';

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
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (table) => [index('guestbook_created_at_idx').on(table.createdAt.desc())],
);

export type Guestbook = typeof guestbook.$inferSelect;
export type NewGuestbook = typeof guestbook.$inferInsert;

export const views = pgTable('views', {
  slug: text('slug').primaryKey(),
  count: integer('count').notNull().default(0),
});

export type View = typeof views.$inferSelect;
