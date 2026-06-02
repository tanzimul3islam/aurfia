import { pgTable, serial, text, integer, doublePrecision, timestamp, boolean } from 'drizzle-orm/pg-core';

// ─── product.db tables ─────────────────────────────────────────────

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  productTitle: text("product_title"),
  brandOrDesigner: text("brand_or_designer"),
  sku: text("sku"),
  itemNumber: text("item_number"),
  priceCurrency: text("price_currency"),
  priceAmount: doublePrecision("price_amount"),
  minimumOrderQuantity: integer("minimum_order_quantity"),
  readyToShipDays: text("ready_to_ship_days"),
  qualityLevel: text("quality_level"),
  description: text("description"),
  detailsJson: text("details_json"),
  rating: doublePrecision("rating"),
  reviewCount: integer("review_count"),
  shippingJson: text("shipping_json"),
  returnsJson: text("returns_json"),
  url: text("url"),
  sellingPrice: doublePrecision("selling_price"),
});

export const productImages = pgTable("product_images", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().references(() => products.id),
  imageUrl: text("image_url"),
  sortOrder: integer("sort_order"),
});

export const productBreadcrumbs = pgTable("product_breadcrumbs", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().references(() => products.id),
  breadcrumb: text("breadcrumb"),
  sortOrder: integer("sort_order"),
});

export const productOptions = pgTable("product_options", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().references(() => products.id),
  optionId: integer("option_id"),
  price: doublePrecision("price"),
  sellingPrice: doublePrecision("selling_price"),
  title: text("title"),
  imageUrl: text("image_url"),
  thumbnailContext: text("thumbnail_context"),
});

// ─── App tables ────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  userName: text("user_name").notNull(),
  imageUrl: text("image_url"),
  role: text("role").notNull().default("customer"),
  email: text("email").notNull(),
  clerkId: text("clerk_id").notNull().unique(),
  createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  stripeId: text("stripe_id").unique(),
  email: text("email"),
  total: integer("total"),
  currency: text("currency"),
  status: text("status").default("pending"),
  shippingAddress: text("shipping_address"),
  billingAddress: text("billing_address"),
  updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
  createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id),
  variantId: integer("variant_id"),
  name: text("name"),
  price: integer("price"),
  quantity: integer("quantity"),
  sku: text("sku"),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title"),
  slug: text("slug").unique(),
  excerpt: text("excerpt"),
  content: text("content"),
  coverImage: text("cover_image"),
  published: boolean("published").default(false),
  updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
  createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const seoMeta = pgTable("seo_meta", {
  id: serial("id").primaryKey(),
  page: text("page"),
  title: text("title"),
  description: text("description"),
  keywords: text("keywords"),
});

export const analyticsSettings = pgTable("analytics_settings", {
  id: text("id").primaryKey(),
  gaCode: text("ga_code"),
  enabled: boolean("enabled").default(false),
});

export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  status: text("status").notNull().default("active"),
  subscribedAt: timestamp("subscribed_at", { mode: 'string' }).defaultNow(),
});
