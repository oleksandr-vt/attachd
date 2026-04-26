CREATE TABLE "attachment_report_orders" (
	"token" varchar(32) PRIMARY KEY NOT NULL,
	"result_token" varchar(16) NOT NULL,
	"report_version" text NOT NULL,
	"status" varchar(16) NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"paid_at" timestamp with time zone,
	"downloaded_at" timestamp with time zone,
	"paddle_transaction_id" text DEFAULT '' NOT NULL,
	"paddle_event_id" text DEFAULT '' NOT NULL,
	"paddle_customer_id" text DEFAULT '' NOT NULL,
	"customer_email" text DEFAULT '' NOT NULL,
	"currency_code" varchar(3) DEFAULT '' NOT NULL,
	"total_amount" text DEFAULT '' NOT NULL,
	"report_ready_email_sent_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "paddle_webhook_events" (
	"event_id" text PRIMARY KEY NOT NULL,
	"event_type" text NOT NULL,
	"notification_id" text DEFAULT '' NOT NULL,
	"received_at" timestamp with time zone NOT NULL,
	"processed_at" timestamp with time zone,
	"processing_error" text DEFAULT '' NOT NULL
);
