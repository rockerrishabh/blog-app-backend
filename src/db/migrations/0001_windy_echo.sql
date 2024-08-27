CREATE TABLE IF NOT EXISTS "passwordResetTokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(256),
	"passwordResetToken" text,
	"popularity" timestamp NOT NULL
);
