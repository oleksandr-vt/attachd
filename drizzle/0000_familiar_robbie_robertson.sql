CREATE TABLE "attachment_results" (
	"token" varchar(16) PRIMARY KEY NOT NULL,
	"slug" varchar(32) NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"question_set_version" text NOT NULL,
	"scoring_version" text NOT NULL,
	"answers" jsonb NOT NULL,
	"result" jsonb NOT NULL,
	"primary_type" varchar(32) NOT NULL,
	"secondary_type" varchar(32) NOT NULL,
	"email" text DEFAULT '' NOT NULL,
	"email_unlocked" boolean DEFAULT false NOT NULL
);
