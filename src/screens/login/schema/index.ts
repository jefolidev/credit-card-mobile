import { z } from 'zod'

export const loginBodySchema = z.object({
  cpf: z
    .string()
    .min(11, 'CPF must be at least 11 characters long')
    .max(14, 'CPF must be at most 14 characters long'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
})

export type LoginBodySchema = z.infer<typeof loginBodySchema>
