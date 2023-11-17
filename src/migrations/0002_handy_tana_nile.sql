ALTER TABLE "links" RENAME COLUMN "50" TO "short";--> statement-breakpoint
ALTER TABLE "links" ALTER COLUMN "short" SET DATA TYPE varchar(50);