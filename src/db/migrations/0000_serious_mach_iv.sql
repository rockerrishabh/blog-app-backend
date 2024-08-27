DO $$ BEGIN
 CREATE TYPE "public"."role" AS ENUM('Admin', 'User', 'Author');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"email" varchar(256) NOT NULL,
	"password" text,
	"role" "role" DEFAULT 'User' NOT NULL,
	"image" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verificationTokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(256),
	"verificationToken" text,
	"popularity" timestamp NOT NULL
);
