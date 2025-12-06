import {
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { User, users } from "./users";
import { relations } from "drizzle-orm";
import { File, files } from "./files";
import { snippets } from "./snippets";

export const snippetViews = pgTable("snippet_views", {
  id: serial().primaryKey(),
  snippetId: integer("snippet_id").references(() => snippets.id, {onDelete: "cascade"}),
  viewerId: integer("viewer_id").references(() => users.id, {onDelete: "no action"}),
  ownerId: integer("owner_id").references(() => users.id, {onDelete: "cascade"}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
    snippetIdIdx: index('snippet_views_snippet_id_idx').on(table.snippetId),
    viewerIdIdx: index('snippet_views_viewer_id_idx').on(table.viewerId),
    ownerIdIdx: index('snippet_views_owner_id_idx').on(table.ownerId),
}));

export const snippetViewRelation = relations(snippetViews, ({ one, many }) => ({
  viewer: one(users, {
    fields: [snippetViews.viewerId],
    references: [users.id],
    relationName: "viewer",

  }),
  owner: one(users, {
    fields: [snippetViews.ownerId],
    references: [users.id],
    relationName: "owner"
  }),
  files: many(files)
}));

export type SnippetView = typeof snippetViews.$inferSelect;
export type NewSnippetView = typeof snippetViews.$inferInsert;

export type BaseSnippetView = SnippetView & {
  files?: File[],
  user?: User,
}
