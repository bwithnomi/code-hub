import { relations } from 'drizzle-orm';
import { boolean, index, integer, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { users } from './users';

export const userPreferences = pgTable('user_preferences', {
    id: serial().primaryKey(),
    userId: integer('user_id').references(() => users.id, {onDelete: "cascade"}).notNull().unique(),
    theme: text('theme').default('system').notNull(),
    editorTheme: text('editor_theme').default('vs-dark').notNull(),
    editorFontSize: integer('editor_font_size').default(14).notNull(),
    defaultLanguage: varchar('default_language', {length: 256}).default('javascript').notNull(),
    aiTitleGenerationEnabled: boolean('ai_title_generation_enabled').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
    userIdIdx: index('user_preferences_user_id_idx').on(table.userId),
}));

export const userPreferencesRelations = relations(userPreferences, ({one}) => ({
    user: one(users, {
        fields: [userPreferences.userId],
        references: [users.id],
    })
}));

export type UserPreferences = typeof userPreferences.$inferSelect;
export type NewUserPreferences = typeof userPreferences.$inferInsert;

export type BaseUserPreferences = UserPreferences & {
    user?: typeof users.$inferSelect,
}

