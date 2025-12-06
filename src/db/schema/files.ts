import { index, integer, pgEnum, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { Snippet, snippets } from './snippets';
import { relations } from 'drizzle-orm';

export const files = pgTable('files', {
    id: serial().primaryKey(),
    name: varchar({length: 256}).notNull(),
    language: varchar({length: 256}).notNull(),
    code: text().notNull(),
    snippetId: integer('snippet_id').references(() => snippets.id, {onDelete: "cascade", onUpdate: "cascade"}),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
    snippetIdIdx: index('files_snippet_id_idx').on(table.snippetId),
}));

export const fileRelations = relations(files, ({one}) => ({
    snippet: one(snippets, {
        fields: [files.snippetId],
        references: [snippets.id],
    })
}))

export type File = typeof files.$inferSelect;
export type NewFile = typeof files.$inferInsert;

export type BaseFile = File & {
  snippet?: Snippet,
}