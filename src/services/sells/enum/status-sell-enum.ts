export const STATUS_SELL = {
  PAID: "PAID",
  IN_CANCELATION: "IN_CANCELATION",
  CANCELED: "CANCELED",
} as const;

export type StatusSell = typeof STATUS_SELL[keyof typeof STATUS_SELL];
