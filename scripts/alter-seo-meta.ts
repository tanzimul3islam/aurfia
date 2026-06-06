import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function main() {
  console.log('Adding new columns to seo_meta table...');

  await sql`ALTER TABLE seo_meta ADD COLUMN IF NOT EXISTS og_title text;`;
  await sql`ALTER TABLE seo_meta ADD COLUMN IF NOT EXISTS og_description text;`;
  await sql`ALTER TABLE seo_meta ADD COLUMN IF NOT EXISTS og_image text;`;
  await sql`ALTER TABLE seo_meta ADD COLUMN IF NOT EXISTS canonical_url text;`;
  await sql`ALTER TABLE seo_meta ADD COLUMN IF NOT EXISTS noindex boolean DEFAULT false;`;
  await sql`ALTER TABLE seo_meta ADD COLUMN IF NOT EXISTS priority double precision;`;

  console.log('Done — seo_meta table updated.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
