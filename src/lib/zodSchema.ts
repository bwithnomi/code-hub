import { z } from 'zod'

export const snippetSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  visibility: z.enum(['public', 'private', 'connections'], {message: "Select Visibility"}),
  files: z.array(
    z.object({
      language: z.string().min(1, 'Language is required'),
      content: z.string().min(1, 'Code content is required'),
    })
  ).min(1, 'At least one file is required').max(3, 'Free tier users can have a maximum of 3 editors per snippet'),
})

export const snippetUpdateSchema = z.object({
  shareId: z.string().min(1).uuid("invalid id"),
  title: z.string().min(1, 'Title is required'),
  visibility: z.enum(['public', 'private', 'connections']),
  files: z.array(
    z.object({
      language: z.string().min(1, 'Language is required'),
      content: z.string().min(1, 'Code content is required'),
    })
  ).min(1, 'At least one file is required').max(3, 'Free tier users can have a maximum of 3 editors per snippet'),
})

export type NewSnippet = z.infer<typeof snippetSchema>
export type UpdateSnippet = z.infer<typeof snippetUpdateSchema>

export const userPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  editorTheme: z.string().min(1, 'Editor theme is required'),
  editorFontSize: z.number().min(12).max(24),
  defaultLanguage: z.string().min(1, 'Default language is required'),
  aiTitleGenerationEnabled: z.boolean(),
});

export type UserPreferencesInput = z.infer<typeof userPreferencesSchema>
