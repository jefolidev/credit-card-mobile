export const STATUS_BILLING = {
  PENDING: "PENDING",
  CLOSED: "CLOSED",
  PAID: "PAID",
  OVERDUE: "OVERDUE",
} as const;

export type StatusBilling = typeof STATUS_BILLING[keyof typeof STATUS_BILLING];
