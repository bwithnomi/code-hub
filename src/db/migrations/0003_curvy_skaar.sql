ALTER TABLE "snippet_views" RENAME COLUMN "user_id" TO "snippet_id";--> statement-breakpoint
ALTER TABLE "snippet_views" DROP CONSTRAINT "snippet_views_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "snippet_views" ADD COLUMN "viewer_id" integer;--> statement-breakpoint
ALTER TABLE "snippet_views" ADD COLUMN "owner_id" integer;--> statement-breakpoint
ALTER TABLE "snippet_views" ADD CONSTRAINT "snippet_views_snippet_id_users_id_fk" FOREIGN KEY ("snippet_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "snippet_views" ADD CONSTRAINT "snippet_views_viewer_id_users_id_fk" FOREIGN KEY ("viewer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "snippet_views" ADD CONSTRAINT "snippet_views_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;