# AURFIA — Agent Guide

## Stack

- **Next.js 16** (App Router), **React 19.2**, **React Compiler** enabled (`reactCompiler: true` in `next.config.ts`)
- **Tailwind CSS v4** via PostCSS (`@tailwindcss/postcss`), brand colors defined in `app/globals.css` via `@theme`
- **Drizzle ORM** + **PostgreSQL** via `@neondatabase/serverless` (Neon)
- **Clerk** for auth (Clerk-managed users + custom super-admin session at `/admin-login`)
- **Cloudinary** for image uploads
- **Stripe** (keys currently empty — integration incomplete)
- **Zustand** for cart state, **localStorage** for favorites

## Commands

```
npm run dev       # dev server on :3000
npm run build     # production build (passes ✅)
npm run start     # start production server
```

No lint, typecheck, or test scripts exist. On build failure, check TS errors manually.

## Key Architecture

- **Route groups**: `(public)/`, `(admin)/`, `(auth)/` — each has its own `layout.tsx`
- **No API routes** — all mutations use Server Actions in `actions/`
- **Middleware**: `proxy.ts` at root (Clerk middleware; renamed from `middleware.ts`)
- **Path alias**: `@/*` → project root
- **Data layer**: `lib/product-helpers.ts` adapts product.db (read-only) to UI-facing types
- **Product DB is read-only** — admin create/update/delete of products returns stubs

## DB Schema (`db/schema.ts`)

### product.db tables (read-only, from scraped data)

| Table | Notes |
|---|---|
| `products` | `id` (serial), `product_title`, `brand_or_designer`, `sku`, `item_number`, `price_currency`, `price_amount` (double, dollars), `minimum_order_quantity`, `ready_to_ship_days`, `quality_level`, `description`, `details_json`, `rating`, `review_count`, `shipping_json`, `returns_json`, `url`, `selling_price` (double, dollars) |
| `product_images` | FK → `products.id` |
| `product_breadcrumbs` | FK → `products.id`, `sort_order` (0=Jewelry, 1=category, 2=subcategory) |
| `product_options` | FK → `products.id`, variants with pricing |

### App tables (managed through admin UI)

| Table | Notes |
|---|---|
| `users` | Mirrors Clerk users; `role` text: `customer` / `admin` |
| `orders` / `order_items` | Stripe flow |
| `blog_posts` | `published` boolean |
| `seo_meta` | |
| `analytics_settings` | GA tracking code, `enabled` boolean |
| `subscribers` | Newsletter |

## Price Handling

- `price_amount` / `selling_price` stored as dollars (REAL) in product.db
- Converted to cents on read via `toCents()` helper in `lib/product-helpers.ts`
- All UI code uses `priceCents` (cents) — displayed as `$X.XX` (USD)

## Database Changes (SQLite → PostgreSQL)

- Schema rewritten from `sqlite-core` to `pg-core` types in `db/schema.ts`
- Connection uses `@neondatabase/serverless` (Neon pool) in `lib/db.ts`
- `drizzle.config.ts` uses `dialect: 'postgresql'`
- Migrate script at `scripts/migrate.ts` reads from legacy `products.db` SQLite file and bulk-inserts into Neon
- Data verified: 150 products, 551 images, 472 breadcrumbs, 475 options

## Categories

- No `categories` table — categories derived dynamically from `product_breadcrumbs.sort_order`
  - `sort_order = 0` → "Jewelry"
  - `sort_order = 1` → category (Earrings, Rings, Necklaces, etc.)
  - `sort_order = 2` → subcategory
- Nav menu (`lib/shop-menu.ts`) lists 10 categories matching DB breadcrumb data
- Shop page filters by `product.category` (sort_order=1) with slug-normalized matching

## Admin Access

Dual gate: `isSuperAdminSession` (custom session token) **or** `isUserAdmin` (Clerk role check). Both checked in `app/(admin)/layout.tsx`. Routes protected by Clerk middleware (`proxy.ts` matcher: `/admin(.*)`).

## Data Scripts (run with `tsx`)

```
npx tsx importProduct.ts             # import old JSON → product.db (one by one)
npx tsx delete.ts                    # delete products by breadcrumb (stub — use with care)
npx tsx products/manageProducts.ts   # filter/export product data to JSON
npx tsx scripts/migrate.ts           # migrate SQLite (products.db) → Neon PostgreSQL
```

## Shopping Flow

- Cart: Zustand store (`lib/cart-store.ts`) — `productId` stored as string (converted from number via `.toString()`)
- Favorites: localStorage, key `favorites`, custom DOM event `favoritesUpdate`
- Search: Client-side at `/search?q=...`
- Product pages: `product/[slug]` — slug derived from `productTitle` via `slugify()`
- Shop: `/shop?category=...&subcategory=...` with client-side filtering

## Types (from `lib/product-helpers.ts`)

- `ProductCardItem` — id, name, slug, price, images[]
- `ProductWithImages` — full card data with category/subcategory
- `ProductDetail` — full detail with variants and images
- `CategoryNode` — name, slug, count, subcategories[] (from `getCategoryTree()`)

## Known Issues / Gotchas

- **`.env` committed** with real secrets (Clerk, Neon, Cloudinary, super-admin creds) — do not push to public remotes
- **Old Clerk keys** in `.txt` at root (another `.env` copy)
- `shop/page.tsx` calls `useSearchParams()` inside `applySorting()` (non-hook function) — violates Rules of Hooks
- products.db (legacy SQLite) still on disk at project root, now migrated to Neon PostgreSQL
- ~150 products across 10 categories from tomade.com (925 sterling silver)
- Admin create/update/delete of products are stubs (product.db is read-only scraped data)
- Stripe integration is incomplete (empty keys)

## Brand / Locale

- Site name: **AURFIA** (header, metadata, footer)
- Language: **English** (en, en_US) — fully localized from German
- Brand colors: `brand` (#000000), `brand-accent` (#8B7355), `brand-light` (#F5F5F0) — defined in `globals.css` `@theme` block
- Fonts: Inter (body), Cormorant Garamond (headings)
- Currency: **USD** ($) — prices formatted as `$X.XX`
- Target: US jewellery audience
