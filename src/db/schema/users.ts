import { relations } from 'drizzle-orm';
import { pgEnum, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { snippets } from './snippets';
import { snippetViews } from './snippet-view';

export const userTierEnum = pgEnum('user_tier', ['free', 'pro', 'enterprise']);

export const users = pgTable('users', {
    id: serial().primaryKey(),
    name: text().notNull(),
    email: text().notNull().unique(),
    clerkId: text('clerk_id').notNull().unique(),
    password: text().notNull(),
    tier: userTierEnum().default('free'),
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


