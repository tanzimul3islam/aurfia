import Database from 'better-sqlite3';

const db = new Database('products.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name TEXT NOT NULL,
    image_url TEXT,
    role TEXT NOT NULL DEFAULT 'customer',
    email TEXT NOT NULL,
    clerk_id TEXT NOT NULL UNIQUE,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    stripe_id TEXT UNIQUE,
    email TEXT,
    total INTEGER,
    currency TEXT,
    status TEXT DEFAULT 'pending',
    shipping_address TEXT,
    billing_address TEXT,
    updated_at TEXT DEFAULT (datetime('now')),
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER REFERENCES orders(id),
    variant_id INTEGER,
    name TEXT,
    price INTEGER,
    quantity INTEGER,
    sku TEXT
  );

  CREATE TABLE IF NOT EXISTS blog_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    slug TEXT UNIQUE,
    excerpt TEXT,
    content TEXT,
    cover_image TEXT,
    published INTEGER DEFAULT 0,
    updated_at TEXT DEFAULT (datetime('now')),
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS seo_meta (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page TEXT,
    title TEXT,
    description TEXT,
    keywords TEXT
  );

  CREATE TABLE IF NOT EXISTS analytics_settings (
    id TEXT PRIMARY KEY,
    ga_code TEXT,
    enabled INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'active',
    subscribed_at TEXT DEFAULT (datetime('now'))
  );
`);

console.log('App tables created successfully');
db.close();
