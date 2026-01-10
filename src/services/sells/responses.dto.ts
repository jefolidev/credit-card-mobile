import type { StatusSell } from './enum/status-sell-enum'

export type ResponseCreateSells = {
  id: string
  buyer: {
    name: string
    cpf: string
  }
  status: StatusSell
  createdAt: Date
  description: string
  amount: number
  installments: number
}

export type ResponseGetLimit = {
  limitAvailable: number
  name: string
  cpf: string
}

export type ResponseSellQrCode = {
  id: number
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

export type ResponseGetAllSells = {
  sells: ResponseGetSell[]
  total: number
  page: number
  limit: number
}

export type ResponseGetSell = {
  description: string
  status: StatusSell
  id: string
  createdAt: Date
  card: {
    cardNumber: string
    user: {
      id: string
      name: string
      cpf: string
    }
  }
  amount: number
  installments: number
  seller: {
    name: string
    cpf: string
    id: string
  }
}
