# AURFIA

Minimalist e-commerce for 925 sterling silver jewelry — modern heirlooms crafted for the everyday.

Built with **Next.js 16** (App Router), **Drizzle ORM** + **Neon PostgreSQL**, and **Stripe Checkout**.

## Tech Stack

| Layer | Choice |
|---|---|
| **Framework** | Next.js 16, React 19, React Compiler |
| **Styling** | Tailwind CSS v4 (via PostCSS) |
| **Database** | Neon PostgreSQL + Drizzle ORM |
| **Auth** | Better Auth (email/password) |
| **Payments** | Stripe Checkout |
| **Media** | Cloudinary |
| **State** | Zustand (cart), localStorage (favorites) |
| **AI** | OpenAI RAG chatbot (pgvector embeddings) |
| **Icons** | Lucide React |

## Features

- **Product catalog** — ~150 scraped products (925 sterling silver), 10 categories with subcategories
- **Shop** — Category/subcategory filtering, search, sort, pagination
- **Cart** — Zustand store persisted to localStorage, slide-out drawer
- **Stripe Checkout** — Redirect-based payment flow with order tracking
- **Wishlist** — localStorage-based favorites
- **AI Chatbot** — RAG-powered assistant answering product/order questions
- **Admin panel** — Products, orders, marketing (SEO, analytics, discount banner), reviews, users, chatbot knowledge base
- **Blog** — Admin-managed blog posts
- **SEO** — Per-page meta tags, Open Graph, structured data, sitemap
- **Responsive** — Mobile-first design (Flexbox, not CSS Grid, for layout safety)

## Getting Started

```bash
npm install
```

Configure your `.env` with the required keys (database, Stripe, Cloudinary, auth):

```bash
npm run dev
# → http://localhost:3000
```

### Seed product data (migrate legacy SQLite to Neon PostgreSQL)

```bash
npx tsx scripts/migrate.ts
```

### Build for production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── (public)/          # Home, shop, product, cart, checkout, search, legal pages
│   ├── (admin)/            # Admin dashboard, products, orders, marketing, chatbot
│   ├── (auth)/             # Sign-in, admin-login
│   └── api/                # Auth, contact, Stripe webhooks
├── actions/                # Server Actions (checkout, chat, products, orders, etc.)
├── components/             # React components (header, footer, chat, product card, etc.)
├── db/                     # Drizzle schema (PostgreSQL), migrations
├── lib/                    # Helpers, stores, auth config, product helpers
└── scripts/                # Migration, seed, data management scripts
```

## Database

Two categories of tables:

**Product data** (read-only, scraped from tomade.com):
- `products`, `product_images`, `product_breadcrumbs`, `product_options`
- Categories derived dynamically from `product_breadcrumbs.sort_order`
- Prices stored as dollars (REAL), converted to cents on read

**App data** (managed through admin UI):
- `orders`, `order_items`, `users`, `reviews`, `blog_posts`
- `seo_meta`, `analytics_settings`, `site_settings`, `subscribers`
- `chat_documents`, `chat_document_chunks` (pgvector), `chat_conversations`, `chat_messages`

## Price Handling

- `price_amount` / `selling_price` stored as dollars (REAL) in the scraped product DB
- Converted to cents on read via `toCents()` helper in `lib/product-helpers.ts`
- All UI code uses `priceCents` (cents) — displayed as `$X.XX` USD

## Scripts

```bash
npx tsx scripts/migrate.ts           # Migrate legacy SQLite → Neon PostgreSQL
npx tsx scripts/seed-admin.ts        # Seed an admin user
npx tsx scripts/fix-sequence.ts      # Fix PostgreSQL sequence gaps
npx tsx importProduct.ts             # Import individual product JSON → product.db
```

## ⚠️ Important

- **`.env` contains real credentials** (Clerk, Neon, Cloudinary, Stripe). Do not push to public remotes.
- **Admin product CRUD is stubbed** — product DB is read-only scraped data.
- **Stripe keys** must be set in `.env` for checkout to function.
- **No test suite** is configured.
- This project was originally in German and has been fully localized to English (en_US).

## Brand

- **Name:** AURFIA
- **Colors:** Black (`#000000`), Gold (`#8B7355`), Warm off-white (`#F5F5F0`)
- **Fonts:** Inter (body), EB Garamond / Cormorant Garamond (headings)
- **Currency:** USD ($)
- **Target:** US jewelry audience
