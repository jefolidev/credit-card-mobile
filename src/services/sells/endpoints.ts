import api from '../../api/api'
import type {
  ResponseCreateSells,
  ResponseGetAllSells,
  ResponseGetLimit,
  ResponseGetSell,
  ResponseSellQrCode,
} from './responses.dto'
import type { CancelSellDto } from './validations/cancel-sell-dto'
import type { ConfirmCancellationDto } from './validations/confirm-cancellation-dto'
import type { CreateQrCodeSellDto } from './validations/create-qr-code-sell.dto'
import type { CreateSellDto } from './validations/create-sell.dto'
import type { FiltersGetSellDto } from './validations/filters-get-sell-dto'
import type { GetLimitDto } from './validations/get-limit-dto'

const getSells = async (
  filters: FiltersGetSellDto
): Promise<ResponseGetAllSells> => {
  try {
    const { data } = await api.get('/sells', { params: filters })
    return data
  } catch (error: any) {
    console.error('❌ Erro ao buscar vendas:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
      params: error.config?.params,
      filters,
    })
    throw error
  }
}

const createSell = async (
  payload: CreateSellDto
): Promise<ResponseCreateSells> => {
  try {
    const { data } = await api.post('/sells', payload)
    return data
  } catch (error) {
    console.error('Error creating sell:', error)
    throw error
  }
}

const getLimit = async (payload: GetLimitDto): Promise<ResponseGetLimit> => {
  try {
    const { data } = await api.post('/sells/get-limit', payload)
    return data
  } catch (error) {
    console.error('Error getting limit:', error)
    throw error
  }
}

const getQrCodeSell = async (): Promise<ResponseSellQrCode[]> => {
  try {
    const { data } = await api.get(`/sells/qrcode`)
    return data
  } catch (error) {
    console.error('Error getting QR code sell:', error)
    throw error
  }
}

const createQrCode = async (
  payload: CreateQrCodeSellDto
): Promise<ResponseSellQrCode> => {
  try {
    const { data } = await api.post('/sells/qrcode', payload)
    return data
  } catch (error) {
    console.error('Error creating QR code:', error)
    throw error
  }
}

const getDetailsSell = async (sellId: string): Promise<ResponseCreateSells> => {
  try {
    const { data } = await api.get(`/sells/${sellId}`)
    return data
  } catch (error) {
    console.error('Error getting sell details:', error)
    throw error
  }
}

const cancelSell = async (
  sellId: string,
  body: CancelSellDto
): Promise<void> => {
  try {
    await api.patch(`/sells/${sellId}/cancel`, body)
  } catch (error) {
    console.error('Error cancelling sell:', error)
    throw error
  }
}

const confirmCancellation = async (
  sellId: string,
  body: ConfirmCancellationDto
): Promise<ResponseGetSell> => {
  try {
    const { data } = await api.patch(`/sells/${sellId}/cancel/confirm`, body)
    return data
  } catch (error) {
    console.error('Error confirming cancellation:', error)
    throw error
  }
}

export {
  cancelSell,
  confirmCancellation,
  createQrCode,
  createSell,
  getDetailsSell,
  getLimit,
  getQrCodeSell,
  getSells,
}
