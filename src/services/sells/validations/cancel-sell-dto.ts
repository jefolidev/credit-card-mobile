import z from 'zod'

const cancelSellDto = z.object({
  reason: z.string().min(1, 'Motivo do cancelamento é obrigatório'),
})

export type CancelSellDto = z.infer<typeof cancelSellDto>
export { cancelSellDto }
