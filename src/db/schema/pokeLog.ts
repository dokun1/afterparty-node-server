import { pgTable, uuid, timestamp, index } from 'drizzle-orm/pg-core';
import { users } from './users';

export const pokeLog = pgTable(
  'poke_log',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    fromUserId: uuid('from_user_id')
      .notNull()
      .references(() => users.id),
    toUserId: uuid('to_user_id')
      .notNull()
      .references(() => users.id),
    pokedAt: timestamp('poked_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('poke_log_rate_limit_idx').on(table.fromUserId, table.toUserId, table.pokedAt),
  ],
);
