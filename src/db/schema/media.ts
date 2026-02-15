import { pgTable, uuid, varchar, text, integer, boolean, timestamp, jsonb, index } from 'drizzle-orm/pg-core';
import { users } from './users';
import { events } from './events';

export const media = pgTable(
  'media',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    eventId: uuid('event_id')
      .notNull()
      .references(() => events.id, { onDelete: 'cascade' }),
    uploadedById: uuid('uploaded_by_id')
      .notNull()
      .references(() => users.id),
    mediaType: varchar('media_type', { length: 10 }).notNull(),
    fullSizeUrl: text('full_size_url').notNull(),
    thumbnailUrl: text('thumbnail_url'),
    mimeType: varchar('mime_type', { length: 100 }).notNull(),
    fileSizeBytes: integer('file_size_bytes').notNull(),
    metadata: jsonb('metadata'),
    downloadable: boolean('downloadable').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('media_event_id_idx').on(table.eventId)],
);
