import 'dotenv/config';
import Database from 'better-sqlite3';
import { Pool } from '@neondatabase/serverless';

const PG = new Pool({ connectionString: process.env.DATABASE_URL });

async function insertBulk(
  table: string,
  rows: Record<string, unknown>[],
  batchSize = 100
) {
  if (rows.length === 0) return;
  const columns = Object.keys(rows[0]!);
  const colNames = columns.join(', ');

  const client = await PG.connect();
  try {
    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize);
      const values = batch
        .map((_, ri) => `(${columns.map((_, ci) => `$${ri * columns.length + ci + 1}`).join(', ')})`)
        .join(', ');
      const params = batch.flatMap((row) => columns.map((c) => row[c] ?? null));
      await client.query(`INSERT INTO ${table} (${colNames}) VALUES ${values}`, params);
    }
  } finally {
    client.release();
  }
}

async function main() {
  // Step 1: Drop
  const drop = `DROP TABLE IF EXISTS verification, account, session, product_options, product_images, product_breadcrumbs, products, order_items, orders, blog_posts, seo_meta, analytics_settings, subscribers, "user" CASCADE;`;
  const pg = await PG.connect();
  try { await pg.query(drop); } finally { pg.release(); }
  console.log('Dropped tables.');

  // Step 2: Create
  const create = `
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY, product_title TEXT, brand_or_designer TEXT,
      sku TEXT, item_number TEXT, price_currency TEXT,
      price_amount DOUBLE PRECISION, minimum_order_quantity INTEGER,
      ready_to_ship_days TEXT, quality_level TEXT, description TEXT,
      details_json TEXT, rating DOUBLE PRECISION, review_count INTEGER,
      shipping_json TEXT, returns_json TEXT, url TEXT,
      selling_price DOUBLE PRECISION
    );
    CREATE TABLE IF NOT EXISTS product_images (
      id SERIAL PRIMARY KEY, product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      image_url TEXT, sort_order INTEGER
    );
    CREATE TABLE IF NOT EXISTS product_breadcrumbs (
      id SERIAL PRIMARY KEY, product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      breadcrumb TEXT, sort_order INTEGER
    );
    CREATE TABLE IF NOT EXISTS product_options (
      id SERIAL PRIMARY KEY, product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      option_id INTEGER, price DOUBLE PRECISION, selling_price DOUBLE PRECISION,
      title TEXT, image_url TEXT, thumbnail_context TEXT
    );
    CREATE TABLE IF NOT EXISTS "user" (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE,
      email_verified BOOLEAN NOT NULL DEFAULT false, image TEXT,
      role TEXT DEFAULT 'customer',
      created_at TIMESTAMP NOT NULL DEFAULT NOW(), updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS session (
      id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES "user"(id),
      token TEXT NOT NULL UNIQUE, expires_at TIMESTAMP NOT NULL,
      ip_address TEXT, user_agent TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(), updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS account (
      id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES "user"(id),
      account_id TEXT NOT NULL, provider_id TEXT NOT NULL,
      access_token TEXT, refresh_token TEXT,
      access_token_expires_at TIMESTAMP, refresh_token_expires_at TIMESTAMP,
      scope TEXT, id_token TEXT, password TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(), updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS verification (
      id TEXT PRIMARY KEY, identifier TEXT NOT NULL, value TEXT NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(), updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY, stripe_id TEXT UNIQUE, email TEXT, total INTEGER,
      currency TEXT, status TEXT DEFAULT 'pending', shipping_address TEXT,
      billing_address TEXT, updated_at TIMESTAMP DEFAULT NOW(),
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS order_items (
      id SERIAL PRIMARY KEY, order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
      variant_id INTEGER, name TEXT, price INTEGER, quantity INTEGER, sku TEXT
    );
    CREATE TABLE IF NOT EXISTS blog_posts (
      id SERIAL PRIMARY KEY, title TEXT, slug TEXT UNIQUE, excerpt TEXT,
      content TEXT, cover_image TEXT, published BOOLEAN DEFAULT false,
      updated_at TIMESTAMP DEFAULT NOW(), created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS seo_meta (
      id SERIAL PRIMARY KEY, page TEXT, title TEXT, description TEXT, keywords TEXT
    );
    CREATE TABLE IF NOT EXISTS analytics_settings (
      id TEXT PRIMARY KEY, ga_code TEXT, enabled BOOLEAN DEFAULT false
    );
    CREATE TABLE IF NOT EXISTS subscribers (
      id SERIAL PRIMARY KEY, email TEXT NOT NULL UNIQUE,
      status TEXT NOT NULL DEFAULT 'active', subscribed_at TIMESTAMP DEFAULT NOW()
    );
  `;
  const pg2 = await PG.connect();
  try { await pg2.query(create); } finally { pg2.release(); }
  console.log('Created tables.');

  // Step 3: Migrate
  const sqlite = new Database('products.db');
  sqlite.pragma('journal_mode = WAL');

  const products = sqlite.prepare('SELECT * FROM products').all() as Record<string, unknown>[];
  await insertBulk('products', products);
  console.log(`Migrated ${products.length} products.`);

  const images = sqlite.prepare('SELECT product_id, image_url, sort_order FROM product_images').all() as Record<string, unknown>[];
  await insertBulk('product_images', images);
  console.log(`Migrated ${images.length} images.`);

  const crumbs = sqlite.prepare('SELECT product_id, breadcrumb, sort_order FROM product_breadcrumbs').all() as Record<string, unknown>[];
  await insertBulk('product_breadcrumbs', crumbs);
  console.log(`Migrated ${crumbs.length} breadcrumbs.`);

  const options = sqlite.prepare('SELECT product_id, option_id, price, selling_price, title, image_url, thumbnail_context FROM product_options').all() as Record<string, unknown>[];
  await insertBulk('product_options', options);
  console.log(`Migrated ${options.length} options.`);

  sqlite.close();
  await PG.end();
  console.log('Migration complete.');
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
