import { z } from 'zod'

export const authCardBodySchema = z.object({
  password: z.string().min(4, 'Password must be at least 4 characters long'),
})

export type AuthCardBodySchema = z.infer<typeof authCardBodySchema>
