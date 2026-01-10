import { StatusBilling } from './enum/status-billing-enum'

export type ResponseGetAllCardsUser = {
  id: string
  cardNumber: string
  name: string
}[]

export type ResponseAuthCard = {
  token: string
}

export type ResponseGetBalanceCard = {
  limitAvailable: number
  name: string
  cpf: string
  totalLimit: number
}

export type ResponseGetPortatorBalance = {
  cardNumber: string
  ownerName: string
  ownerCpf: string
  limitAvailable: number
  totalLimit: number
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
