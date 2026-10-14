CREATE TABLE "rate_limit_buckets" (
	"key" varchar(128) NOT NULL,
	"window_start" timestamp with time zone NOT NULL,
	"hits" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "rate_limit_buckets_key_window_start_pk" PRIMARY KEY("key","window_start")
);
--> statement-breakpoint
CREATE INDEX "attachment_couples_reports_source_pair_idx" ON "attachment_couples_reports" USING btree ("left_source_token","right_source_token","report_version");--> statement-breakpoint
CREATE INDEX "attachment_results_email_verification_token_hash_idx" ON "attachment_results" USING btree ("email_verification_token_hash");