
import z from 'zod';
import { STATUS_SELL } from '../enum/status-sell-enum';

const filtersGetSellDto = z.object({
  limit: z.number().int().min(1).max(100).optional(),
  page: z.number().int().min(1).optional(),
  description: z.string().optional(),
  minAmount: z.number().min(0).optional(),
  maxAmount: z.number().min(0).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z
    .enum([STATUS_SELL.PAID, STATUS_SELL.IN_CANCELATION, STATUS_SELL.CANCELED])
    .optional(),
  asc: z.boolean().optional(),
});

export type FiltersGetSellDto = z.infer<typeof filtersGetSellDto>;
export { filtersGetSellDto };
