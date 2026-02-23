CREATE TABLE "knowledge_source" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_email" text NOT NULL,
	"type" text NOT NULL,
	"name" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"source_url" text,
	"content" text,
	"meta_data" text,
	"last_updated" text DEFAULT now(),
	"created_at" text DEFAULT now()
);
