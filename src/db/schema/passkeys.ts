import { pgTable, uuid, text, bigint, varchar, boolean, timestamp, index } from 'drizzle-orm/pg-core';
import { users } from './users';

export const passkeyCredentials = pgTable(
  'passkey_credentials',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    credentialId: text('credential_id').notNull().unique(),
    publicKey: text('public_key').notNull(),
    counter: bigint('counter', { mode: 'number' }).notNull().default(0),
    transports: text('transports'),
    deviceType: varchar('device_type', { length: 32 }),
    backedUp: boolean('backed_up').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('passkey_credentials_user_id_idx').on(table.userId)],
);
