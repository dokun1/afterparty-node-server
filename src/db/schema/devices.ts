import { pgTable, uuid, varchar, text, timestamp, unique } from 'drizzle-orm/pg-core';
import { users } from './users';

export const devices = pgTable(
  'devices',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    platform: varchar('platform', { length: 10 }).notNull(),
    pushToken: text('push_token').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [unique('devices_user_platform_unique').on(table.userId, table.platform)],
);
