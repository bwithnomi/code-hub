CREATE TYPE "public"."user_tier" AS ENUM('free', 'pro', 'enterprise');--> statement-breakpoint
CREATE TYPE "public"."visibility" AS ENUM('public', 'private', 'connections');--> statement-breakpoint
CREATE TABLE "files" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"language" varchar(256) NOT NULL,
	"code" text NOT NULL,
	"snippet_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"clerkId" text NOT NULL,
	"password" text NOT NULL,
	"tier" "user_tier" DEFAULT 'free',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_clerkId_unique" UNIQUE("clerkId")
);
--> statement-breakpoint
CREATE TABLE "snippets" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"share_id" varchar NOT NULL,
	"visibility" "visibility" DEFAULT 'private',
	"user_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "snippets_share_id_unique" UNIQUE("share_id")
);
--> statement-breakpoint
CREATE TABLE "snippet_views" (
	"id" serial PRIMARY KEY NOT NULL,
	"snippet_id" integer,
	"viewer_id" integer,
	"owner_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_preferences" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"theme" text DEFAULT 'system' NOT NULL,
	"editor_theme" text DEFAULT 'vs-dark' NOT NULL,
	"editor_font_size" integer DEFAULT 14 NOT NULL,
	"default_language" varchar(256) DEFAULT 'javascript' NOT NULL,
	"ai_title_generation_enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_preferences_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_snippet_id_snippets_id_fk" FOREIGN KEY ("snippet_id") REFERENCES "public"."snippets"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "snippets" ADD CONSTRAINT "snippets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "snippet_views" ADD CONSTRAINT "snippet_views_snippet_id_snippets_id_fk" FOREIGN KEY ("snippet_id") REFERENCES "public"."snippets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "snippet_views" ADD CONSTRAINT "snippet_views_viewer_id_users_id_fk" FOREIGN KEY ("viewer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "snippet_views" ADD CONSTRAINT "snippet_views_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "files_snippet_id_idx" ON "files" USING btree ("snippet_id");--> statement-breakpoint
CREATE INDEX "snippets_user_id_idx" ON "snippets" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "snippet_views_snippet_id_idx" ON "snippet_views" USING btree ("snippet_id");--> statement-breakpoint
CREATE INDEX "snippet_views_viewer_id_idx" ON "snippet_views" USING btree ("viewer_id");--> statement-breakpoint
CREATE INDEX "snippet_views_owner_id_idx" ON "snippet_views" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "user_preferences_user_id_idx" ON "user_preferences" USING btree ("user_id");