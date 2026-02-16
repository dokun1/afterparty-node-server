import {
  pgTable,
  uuid,
  varchar,
  text,
  real,
  boolean,
  timestamp,
  jsonb,
  index,
  customType,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './users';

const tsvector = customType<{ data: string }>({
  dataType() {
    return 'tsvector';
  },
});

const geography = customType<{ data: string }>({
  dataType() {
    return 'geography(Point, 4326)';
  },
});

export const events = pgTable(
  'events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 300 }).notNull(),
    description: text('description'),
    createdById: uuid('created_by_id')
      .notNull()
      .references(() => users.id),
    latitude: real('latitude').notNull(),
    longitude: real('longitude').notNull(),
    location: geography('location'),
    foursquareData: jsonb('foursquare_data'),
    tags: text('tags').array(),
    isPrivate: boolean('is_private').notNull().default(false),
    passwordHash: varchar('password_hash', { length: 255 }),
    mediaAccepts: text('media_accepts').array().default(sql`ARRAY['photo','video','audio']`),
    startDate: timestamp('start_date', { withTimezone: true }).notNull(),
    endDate: timestamp('end_date', { withTimezone: true }).notNull(),
    destroyDate: timestamp('destroy_date', { withTimezone: true }).notNull(),
    searchVector: tsvector('search_vector'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('events_search_vector_idx').using('gin', table.searchVector),
    index('events_location_idx').using('gist', table.location),
    index('events_end_date_idx').on(table.endDate),
    index('events_destroy_date_idx').on(table.destroyDate),
    index('events_tags_idx').using('gin', table.tags),
  ],
);
