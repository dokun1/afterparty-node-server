import { pgTable, uuid, varchar, timestamp, primaryKey } from 'drizzle-orm/pg-core';
import { users } from './users';
import { events } from './events';

export const eventMembers = pgTable(
  'event_members',
  {
    eventId: uuid('event_id')
      .notNull()
      .references(() => events.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    role: varchar('role', { length: 20 }).notNull(),
    joinedAt: timestamp('joined_at', { withTimezone: true }).notNull().defaultNow(),
    bootedAt: timestamp('booted_at', { withTimezone: true }),
  },
  (table) => [primaryKey({ columns: [table.eventId, table.userId] })],
);
