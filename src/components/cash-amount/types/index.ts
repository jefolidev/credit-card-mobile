type IconType = 'arrow-up' | 'credit-card'
type VariantType = 'primary' | 'destructive'
type BillStatusType = 'open' | 'paid' | 'overdue'

type CashAmountBase = {
  iconType?: IconType
  footer?: string
  dueDate?: Date
}

type CashVariantUserBalance = CashAmountBase & {
  variant: 'user-balance'
}

type CashVariantBill = CashAmountBase & {
  variant: 'bill'
  creditCardBillStatus: BillStatusType
}

export type CashAmountProps = CashVariantUserBalance | CashVariantBill
