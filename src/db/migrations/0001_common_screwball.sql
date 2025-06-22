ALTER TABLE "files" DROP CONSTRAINT "files_snippet_id_snippets_id_fk";
--> statement-breakpoint
ALTER TABLE "snippets" DROP CONSTRAINT "snippets_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_snippet_id_snippets_id_fk" FOREIGN KEY ("snippet_id") REFERENCES "public"."snippets"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "snippets" ADD CONSTRAINT "snippets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;