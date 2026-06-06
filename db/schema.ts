import { pgTable, serial, text, integer, doublePrecision, timestamp, boolean, vector } from 'drizzle-orm/pg-core';

// ─── Better Auth tables ────────────────────────────────────────────

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  role: text("role").default("customer"),
  createdAt: timestamp("created_at", { mode: "string" }).notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at", { mode: "string" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { mode: "string" }).notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull(),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", { mode: "string" }),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { mode: "string" }),
  scope: text("scope"),
  idToken: text("id_token"),
  password: text("password"),
  createdAt: timestamp("created_at", { mode: "string" }).notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { mode: "string" }).notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull(),
});

// ─── product.db tables (read-only) ─────────────────────────────────

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
  ogTitle: text("og_title"),
  ogDescription: text("og_description"),
  ogImage: text("og_image"),
  canonicalUrl: text("canonical_url"),
  noindex: boolean("noindex").default(false),
  priority: doublePrecision("priority"),
});

export const analyticsSettings = pgTable("analytics_settings", {
  id: text("id").primaryKey(),
  gaCode: text("ga_code"),
  enabled: boolean("enabled").default(false),
});

export const siteSettings = pgTable("site_settings", {
  id: text("id").primaryKey(),
  discountBannerText: text("discount_banner_text"),
  discountBannerEnabled: boolean("discount_banner_enabled").default(false),
  discountBannerLink: text("discount_banner_link"),
  discountBannerBgColor: text("discount_banner_bg_color").default('#000000'),
  discountBannerTextColor: text("discount_banner_text_color").default('#ffffff'),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().references(() => products.id),
  userId: text("user_id").notNull().references(() => user.id),
  userName: text("user_name").notNull(),
  rating: integer("rating").notNull(),
  title: text("title"),
  content: text("content").notNull(),
  isVerifiedPurchase: boolean("is_verified_purchase").default(false),
  createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

// ─── Chatbot tables ────────────────────────────────────────────────

export const chatDocuments = pgTable("chat_documents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  fileType: text("file_type"),
  fileUrl: text("file_url"),
  chunkCount: integer("chunk_count").default(0),
  createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const chatDocumentChunks = pgTable("chat_document_chunks", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id").references(() => chatDocuments.id, { onDelete: 'cascade' }),
  content: text("content").notNull(),
  embedding: vector("embedding", { dimensions: 1536 }),
  metadata: text("metadata"),
  createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const chatConversations = pgTable("chat_conversations", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id),
  title: text("title").default("New conversation"),
  createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => chatConversations.id, { onDelete: 'cascade' }),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});
