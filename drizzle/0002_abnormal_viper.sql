CREATE TABLE "analytics_settings" (
	"id" uuid DEFAULT gen_random_uuid(),
	"gaCode" varchar,
	"enabled" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "seo_meta" (
	"id" uuid DEFAULT gen_random_uuid(),
	"page" varchar,
	"title" varchar,
	"description" varchar,
	"keywords" varchar
);
