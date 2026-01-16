import { StatusBilling } from './enum/status-billing-enum'

type STATUS_USER_CARD = 'ACTIVE' | 'INACTIVE' | 'BLOCKED'

export type ResponseGetAllCardsUser = {
  id: string
  cardNumber: string
  name: string
  status: STATUS_USER_CARD
}[]

export type ResponseAuthCard = {
  token: string
}

export type ResponseGetBalanceCard = {
  cpf: string
  limitAvailable: number
  limitInstallments: number
  name: string
  status: STATUS_USER_CARD
  totalLimit: number
}

export type ResponseGetPortatorBalance = {
  cardNumber: string
  ownerName?: string
  ownerCpf?: string
  name?: string
  cpf?: string
  limitAvailable: number
  totalLimit: number
  limitInstallments?: number
  status?: STATUS_USER_CARD
}

export type ResponseGetBillingsCards = {
  id: string
  monthAndYear: string
  dateStartBilling: Date
  dateEndBilling: Date
  status: StatusBilling
  totalAmount: number
  totalInstallments: number
}[]

export type ResponseGetBillingDetails = {
  id: string
  status: StatusBilling
  sellInstallments: {
    amount: number
    installmentNumber: number
    dueDate: Date
    sell: {
      id: string
      shop: {
        name: string
        cnpj: string
      }
      description: string
      installments: number
    }
  }[]
  monthAndYear: string
  dateStartBilling: Date
  dateEndBilling: Date
}

export type ResponseSellByQrCodeDto = {
  id: string
  seller: {
    name: string
    id: string
  }
  shop: {
    id: string
    name: string
    cnpj: string
  }
  amount: number
  installments: number
  valueInstallment: number
  description: string
  expiresIn: number
}

export type ResponseBuyByQrCodeDto = {
  id: string
  sellerId: string
  amount: number
  description: string
  installments: number
}

export type ResponseWithMessageDto = {
  message: string
}
