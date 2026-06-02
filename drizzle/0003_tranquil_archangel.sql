ALTER TABLE "analytics_settings" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "analytics_settings" ALTER COLUMN "id" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "analytics_settings" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "analytics_settings" ALTER COLUMN "id" SET NOT NULL;