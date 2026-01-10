import { createContext, useCallback, useContext, useState } from 'react'
import {
  cancelSell as cancelSellEndpoint,
  confirmCancellation,
  createQrCode as createQrCodeEndpoint,
  createSell as createSellEndpoint,
  getSells as getSellsEndpoint,
} from 'src/services/sells/endpoints'
import {
  ResponseCreateSells,
  ResponseGetAllSells,
  ResponseGetSell,
  ResponseSellQrCode,
} from 'src/services/sells/responses.dto'
import { CancelSellDto } from 'src/services/sells/validations/cancel-sell-dto'
import { CreateQrCodeSellDto } from 'src/services/sells/validations/create-qr-code-sell.dto'
import { CreateSellDto } from 'src/services/sells/validations/create-sell.dto'
import { FiltersGetSellDto } from 'src/services/sells/validations/filters-get-sell-dto'

interface SellsContextProps {
  sells: ResponseGetSell[]

  getSells: (filters?: FiltersGetSellDto) => Promise<ResponseGetAllSells>
  createQrCode: (payload: CreateQrCodeSellDto) => Promise<ResponseSellQrCode>
  createSell: (payload: CreateSellDto) => Promise<ResponseCreateSells>
  cancelSell: (sellId: string, cancelData: CancelSellDto) => Promise<void>
  confirmSell: (sellId: string, confirm: boolean) => Promise<void>
}

const SellsContext = createContext<SellsContextProps>({} as SellsContextProps)

export function SellsProvider({ children }: { children: React.ReactNode }) {
  const [sells, setSells] = useState<ResponseGetSell[]>([])

  const getSells = useCallback(
    async (filters: FiltersGetSellDto = {}): Promise<ResponseGetAllSells> => {
      try {
        const response = await getSellsEndpoint(filters)
        setSells(response.sells || [])
        return response
      } catch (error) {
        console.error('❌ Erro ao buscar vendas:', error)
        throw error
      }
    },
    []
  )

  const createQrCode = useCallback(
    async ({
      amount,
      description,
      installments,
    }: CreateQrCodeSellDto): Promise<ResponseSellQrCode> => {
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
    },
    []
  )

  const createSell = useCallback(
    async (payload: CreateSellDto): Promise<ResponseCreateSells> => {
      try {
        const response = await createSellEndpoint(payload)
        return response
      } catch (error) {
        console.error('❌ Erro na criação da venda:', error)
        throw error
      }
    },
    []
  )

  const cancelSell = useCallback(
    async (sellId: string, cancelData: CancelSellDto) => {
      try {
        await cancelSellEndpoint(sellId, cancelData)
      } catch (error) {
        console.error('❌ Erro ao cancelar a venda:', error)
        throw error
      }
    },
    []
  )

  const confirmSell = useCallback(async (sellId: string, confirm: boolean) => {
    try {
      await confirmCancellation(sellId, { confirm })
    } catch (error) {
      console.error('❌ Erro ao confirmar a venda:', error)
    }
  }, [])

  return (
    <SellsContext.Provider
      value={{
        sells,
        getSells,
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
