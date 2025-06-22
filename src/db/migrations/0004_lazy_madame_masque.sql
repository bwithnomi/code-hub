ALTER TABLE "snippet_views" DROP CONSTRAINT "snippet_views_snippet_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "snippet_views" ADD CONSTRAINT "snippet_views_snippet_id_snippets_id_fk" FOREIGN KEY ("snippet_id") REFERENCES "public"."snippets"("id") ON DELETE cascade ON UPDATE no action;