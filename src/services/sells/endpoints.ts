import api from '../../api/api'
import type {
  ResponseCreateSells,
  ResponseGetAllSells,
  ResponseGetLimit,
  ResponseGetSell,
  ResponseSellQrCode,
} from './responses.dto'
import type { ConfirmCancellationDto } from './validations/confirm-cancellation-dto'
import type { CreateQrCodeSellDto } from './validations/create-qr-code-sell.dto'
import type { CreateSellDto } from './validations/create-sell.dto'
import type { FiltersGetSellDto } from './validations/filters-get-sell-dto'
import type { GetLimitDto } from './validations/get-limit-dto'

const getSells = async (
  filters: FiltersGetSellDto
): Promise<ResponseGetAllSells> => {
  const { data } = await api.get('/sells', { params: filters })
  return data
}

const createSell = async (
  payload: CreateSellDto
): Promise<ResponseCreateSells> => {
  const { data } = await api.post('/sells', payload)
  return data
}

const getLimit = async (payload: GetLimitDto): Promise<ResponseGetLimit> => {
  const { data } = await api.post('/sells/get-limit', payload)
  return data
}

const getQrCodeSell = async (): Promise<ResponseSellQrCode[]> => {
  const { data } = await api.get(`/sells/qrcode`)
  return data
}

const createQrCode = async (
  payload: CreateQrCodeSellDto
): Promise<ResponseSellQrCode> => {
  const { data } = await api.post('/sells/qrcode', payload)
  return data
}

const getDetailsSell = async (sellId: string): Promise<ResponseCreateSells> => {
  const { data } = await api.get(`/sells/${sellId}`)
  return data
}

const cancelSell = async (sellId: string): Promise<void> => {
  await api.patch(`/sells/${sellId}/cancel`)
}

const confirmCancellation = async (
  sellId: string,
  body: ConfirmCancellationDto
): Promise<ResponseGetSell> => {
  const { data } = await api.patch(`/sells/${sellId}/cancel/confirm`, body)
  return data
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
