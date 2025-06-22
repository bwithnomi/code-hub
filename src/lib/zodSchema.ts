import { z } from 'zod'

export const snippetSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  visibility: z.enum(['public', 'private', 'connections']),
  files: z.array(
    z.object({
      language: z.string().min(1, 'Language is required'),
      content: z.string().min(1, 'Code content is required'),
    })
  ).min(1, 'At least one file is required'),
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
  ).min(1, 'At least one file is required'),
})

export type NewSnippet = z.infer<typeof snippetSchema>
export type UpdateSnippet = z.infer<typeof snippetUpdateSchema>
