ALTER TABLE "guestbook" ADD COLUMN "status" text DEFAULT 'approved' NOT NULL;--> statement-breakpoint
ALTER TABLE "guestbook" ADD COLUMN "ip_hash" text;--> statement-breakpoint
CREATE INDEX "guestbook_ip_hash_idx" ON "guestbook" USING btree ("ip_hash","created_at");