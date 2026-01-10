import z from 'zod'
import { STATUS_SELL } from '../enum/status-sell-enum'

const filtersGetSellDto = z.object({
  limit: z.string().optional(),
  page: z.string().optional(),
  userId: z.string().uuid().optional(),
  description: z.string().optional(),
  minAmount: z.string().optional(),
  maxAmount: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z
    .enum([STATUS_SELL.PAID, STATUS_SELL.IN_CANCELATION, STATUS_SELL.CANCELED])
    .optional(),
  asc: z.coerce.boolean().optional(),
})

export type FiltersGetSellDto = z.infer<typeof filtersGetSellDto>
export { filtersGetSellDto }
