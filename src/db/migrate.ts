import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sql = neon(process.env.DATABASE_URL!);

async function runStatement(statement: string, label?: string) {
  try {
    await sql(statement);
    if (label) console.log(`  OK: ${label}`);
  } catch (err: unknown) {
    const msg = (err as Error).message;
    if (msg.includes('already exists')) {
      console.log(`  Skipped (already exists): ${label ?? statement.slice(0, 60)}...`);
      return;
    }
    throw err;
  }
}

async function migrate() {
  // 1. Enable PostGIS
  console.log('Enabling PostGIS extension...');
  await sql`CREATE EXTENSION IF NOT EXISTS postgis`;

  // 2. Run Drizzle-generated migration
  console.log('Running schema migration...');
  const migrationPath = join(__dirname, '../../drizzle/0000_cloudy_kid_colt.sql');
  const migrationSql = readFileSync(migrationPath, 'utf-8');

  const statements = migrationSql
    .split('--> statement-breakpoint')
    .map((s) => s.trim())
    .filter(Boolean);

  for (const statement of statements) {
    // The geography type needs tagged template for Neon HTTP driver
    if (statement.includes('geography(Point, 4326)')) {
      // Create the table without the geography column first
      const withoutGeo = statement.replace(
        /\s*"location"\s+"geography\(Point,\s*4326\)",?\n?/,
        '\n',
      );
      await runStatement(withoutGeo, 'CREATE TABLE events (without geography)');

      // Add geography column via tagged template
      try {
        await sql`ALTER TABLE events ADD COLUMN IF NOT EXISTS location geography(Point, 4326)`;
        console.log('  OK: Added geography column to events');
      } catch (err: unknown) {
        const msg = (err as Error).message;
        if (msg.includes('already exists')) {
          console.log('  Skipped (already exists): geography column');
        } else {
          throw err;
        }
      }
      continue;
    }

    await runStatement(statement, statement.slice(0, 70));
  }

  // 3. Create PostGIS trigger: auto-populate location from lat/lng
  console.log('Creating PostGIS location trigger...');
  await sql`
    CREATE OR REPLACE FUNCTION update_event_location()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.location := ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql
  `;

  await sql`DROP TRIGGER IF EXISTS trg_update_event_location ON events`;

  await sql`
    CREATE TRIGGER trg_update_event_location
    BEFORE INSERT OR UPDATE OF latitude, longitude ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_event_location()
  `;

  // 4. Create full-text search trigger
  console.log('Creating full-text search trigger...');
  await sql`
    CREATE OR REPLACE FUNCTION update_event_search_vector()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.search_vector :=
        setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(array_to_string(NEW.tags, ' '), '')), 'C');
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql
  `;

  await sql`DROP TRIGGER IF EXISTS trg_update_event_search_vector ON events`;

  await sql`
    CREATE TRIGGER trg_update_event_search_vector
    BEFORE INSERT OR UPDATE OF name, description, tags ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_event_search_vector()
  `;

  console.log('Migration complete! All tables, indexes, and triggers created.');
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
