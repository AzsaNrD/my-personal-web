CREATE TABLE "guestbook" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"avatar" text,
	"provider" text NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "guestbook_created_at_idx" ON "guestbook" USING btree ("created_at" DESC NULLS LAST);