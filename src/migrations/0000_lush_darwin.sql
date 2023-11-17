CREATE TABLE IF NOT EXISTS "links" (
	"id" serial PRIMARY KEY NOT NULL,
	"link" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
