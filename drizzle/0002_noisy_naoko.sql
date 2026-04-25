ALTER TABLE "attachment_results" ADD COLUMN "email_verification_token_hash" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "attachment_results" ADD COLUMN "email_verification_sent_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "attachment_results" ADD COLUMN "email_verification_expires_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "attachment_results" ADD COLUMN "email_verified_at" timestamp with time zone;