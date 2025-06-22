import { relations } from 'drizzle-orm';
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { snippets } from './snippets';
import { snippetViews } from './snippet-view';

export const users = pgTable('users', {
    id: serial().primaryKey(),
    name: text().notNull(),
    email: text().notNull().unique(),
    clerkId: text().notNull().unique(),
    password: text().notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const userRelations = relations(users, ({many, one}) => ({
    snippets: many(snippets),
    views: many(snippetViews, {relationName: "owner"}),
    viewer: many(snippetViews, {relationName: "viewer"}),
}))

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;


