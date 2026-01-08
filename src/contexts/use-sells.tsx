import { createContext, useContext, useState } from 'react'
import {
  cancelSell as cancelSellEndpoint,
  confirmCancellation,
  createQrCode as createQrCodeEndpoint,
  createSell as createSellEndpoint,
} from 'src/services/sells/endpoints'
import {
  ResponseCreateSells,
  ResponseGetSell,
  ResponseSellQrCode,
} from 'src/services/sells/responses.dto'
import { CreateQrCodeSellDto } from 'src/services/sells/validations/create-qr-code-sell.dto'
import { CreateSellDto } from 'src/services/sells/validations/create-sell.dto'

interface SellsContextProps {
  sells: ResponseGetSell[]
  createQrCode: (payload: CreateQrCodeSellDto) => Promise<ResponseSellQrCode>
  createSell: (payload: CreateSellDto) => Promise<ResponseCreateSells>
  cancelSell: (sellId: string) => Promise<void>
  confirmSell: (sellId: string, confirm: boolean) => Promise<void>
}

const SellsContext = createContext<SellsContextProps>({} as SellsContextProps)

export function SellsProvider({ children }: { children: React.ReactNode }) {
  const [sells, setSells] = useState<ResponseGetSell[]>([])

  async function createQrCode({
    amount,
    description,
    installments,
  }: CreateQrCodeSellDto): Promise<ResponseSellQrCode> {
    try {
      const sellData = {
        amount,
        description,
        installments,
      }

      const response = await createQrCodeEndpoint(sellData)
      return response
    } catch (error) {
      console.error('❌ Erro na criação do QR Code:', error)
      throw error
    }
  }

  async function createSell(
    payload: CreateSellDto
  ): Promise<ResponseCreateSells> {
    try {
      const response = await createSellEndpoint(payload)
      return response
    } catch (error) {
      console.error('❌ Erro na criação da venda:', error)
      throw error
    }
  }

  async function cancelSell(sellId: string) {
    try {
      await cancelSellEndpoint(sellId)
    } catch (error) {
      console.error('❌ Erro ao cancelar a venda:', error)
      throw error
    }
  }

  async function confirmSell(sellId: string, confirm: boolean) {
    try {
      await confirmCancellation(sellId, { confirm })
    } catch (error) {
      console.error('❌ Erro ao confirmar a venda:', error)
    }
  }

  return (
    <SellsContext.Provider
      value={{
        sells,
        createQrCode,
        createSell,
        cancelSell,
        confirmSell,
      }}
    >
      {children}
    </SellsContext.Provider>
  )
}

export function useSells() {
  const context = useContext(SellsContext)
  return context
}
