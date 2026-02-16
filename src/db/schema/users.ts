import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 320 }).notNull().unique(),
  displayName: varchar('display_name', { length: 100 }),
  realName: varchar('real_name', { length: 200 }),
  description: text('description'),
  avatarUrl: text('avatar_url'),
  authAvatarUrl: text('auth_avatar_url'),
  homeLocation: text('home_location'),
  appleSubject: varchar('apple_subject', { length: 255 }).unique(),
  googleSubject: varchar('google_subject', { length: 255 }).unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
