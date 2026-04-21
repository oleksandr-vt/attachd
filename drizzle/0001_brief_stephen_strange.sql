CREATE TABLE "attachment_couples_reports" (
	"token" varchar(16) PRIMARY KEY NOT NULL,
	"slug" varchar(32) NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"report_version" text NOT NULL,
	"left_source_token" varchar(16) DEFAULT '' NOT NULL,
	"right_source_token" varchar(16) DEFAULT '' NOT NULL,
	"left_primary_type" varchar(32) NOT NULL,
	"right_primary_type" varchar(32) NOT NULL,
	"left_result" jsonb NOT NULL,
	"right_result" jsonb NOT NULL,
	"report" jsonb NOT NULL
);
