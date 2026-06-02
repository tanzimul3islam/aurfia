CREATE TYPE "public"."role" AS ENUM('customer', 'admin');--> statement-breakpoint
CREATE TABLE "blogPosts" (
	"id" uuid DEFAULT gen_random_uuid(),
	"title" varchar,
	"slug" varchar,
	"excerpt" varchar,
	"content" varchar,
	"coverImage" varchar,
	"published" boolean DEFAULT false,
	"updatedAt" timestamp DEFAULT now(),
	"createdAt" timestamp DEFAULT now(),
	CONSTRAINT "blogPosts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"slug" varchar NOT NULL,
	CONSTRAINT "categories_name_unique" UNIQUE("name"),
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "orderItems" (
	"id" uuid DEFAULT gen_random_uuid(),
	"orderId" uuid,
	"productId" varchar,
	"name" varchar,
	"price" integer,
	"quanitity" integer,
	"sku" varchar
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"stripeId" varchar,
	"email" varchar,
	"total" integer,
	"currency" varchar,
	"status" varchar DEFAULT 'pending',
	"shippingAddress" varchar,
	"billingAddress" varchar,
	"updatedAt" timestamp DEFAULT now(),
	"createdAt" timestamp DEFAULT now(),
	CONSTRAINT "orders_stripeId_unique" UNIQUE("stripeId"),
	CONSTRAINT "orders_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "productImages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" varchar,
	"width" integer,
	"height" integer,
	"alt" varchar,
	"sort" integer DEFAULT 0,
	"productId" uuid
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"description" varchar NOT NULL,
	"priceCents" integer NOT NULL,
	"currency" varchar DEFAULT 'EUR' NOT NULL,
	"compareAtCents" integer,
	"sku" varchar,
	"stock" integer DEFAULT 0,
	"featured" boolean DEFAULT false,
	"categoryId" uuid,
	"updatedAt" timestamp DEFAULT now(),
	"createdAt" timestamp DEFAULT now(),
	CONSTRAINT "products_slug_unique" UNIQUE("slug"),
	CONSTRAINT "products_sku_unique" UNIQUE("sku")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userName" varchar(255) NOT NULL,
	"imageUrl" varchar,
	"role" "role" DEFAULT 'customer' NOT NULL,
	"email" varchar(255) NOT NULL,
	"clerkId" varchar NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	CONSTRAINT "users_clerkId_unique" UNIQUE("clerkId")
);
--> statement-breakpoint
ALTER TABLE "orderItems" ADD CONSTRAINT "orderItems_orderId_orders_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "productImages" ADD CONSTRAINT "productImages_productId_products_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_categories_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;