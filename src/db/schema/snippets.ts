import {
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

export const visibilityEnum = pgEnum("visibility", [
  "public",
  "private",
  "connections",
]);

export const snippets = pgTable("snippets", {
  id: serial().primaryKey(),
  title: text().notNull(),
  shareId: varchar("share_id").notNull().unique(),
  visibility: visibilityEnum().default("private"),
  userId: integer("user_id").references(() => users.id, {onDelete: "cascade"}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const snippetRelation = relations(snippets, ({ one, many }) => ({
  user: one(users, {
    fields: [snippets.userId],
    references: [users.id],
  }),
  files: many(files)
}));

export type Snippet = typeof snippets.$inferSelect;
export type NewSnippet = typeof snippets.$inferInsert;

export type BaseSnippet = Snippet & {
  files?: File[],
  user?: User,
}
