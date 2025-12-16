import { BillStatus } from '..'

type IconType = 'arrow-up' | 'credit-card'
type VariantType = 'primary' | 'destructive'

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
  creditCardBillStatus: BillStatus
}

export type CashAmountProps = CashVariantUserBalance | CashVariantBill
