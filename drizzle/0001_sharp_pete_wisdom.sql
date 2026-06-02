CREATE TABLE "subscribers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"status" varchar DEFAULT 'active' NOT NULL,
	"subscribedAt" timestamp DEFAULT now(),
	CONSTRAINT "subscribers_email_unique" UNIQUE("email")
);
