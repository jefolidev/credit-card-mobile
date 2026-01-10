import axios, { AxiosError, isAxiosError } from 'axios'
import { Platform } from 'react-native'

// Função para obter o IP local da máquina
const getLocalIP = () => {
  // IP local descoberto: 192.168.1.5
  return '192.168.1.5'
}

// Base URL dinâmica por ambiente/plataforma
const getApiUrl = () => {
  const localIP = getLocalIP()

  if (Platform.OS === 'android') {
    // Para Android Emulator - usar 10.0.2.2 para acessar localhost da máquina host
    return `http://${localIP}:3000`
  } else if (Platform.OS === 'ios') {
    // Para iOS Simulator - usar IP da máquina host
    return `http://${localIP}:3000`
  }
  0 // Fallback para web/outras plataformas
  return 'http://localhost:3000'
}

const baseURL = getApiUrl()

let authToken: string | null = null
let cardAuthToken: string | null = null

export function setAuthToken(token: string | null) {
  authToken = token
    ? token.startsWith('Bearer ')
      ? token
      : `Bearer ${token}`
    : null
}

export function getAuthToken(): string | null {
  return authToken
}

export function clearAuthToken() {
  authToken = null
}

// Funções para gerenciar token de cartão
export function setCardAuthToken(token: string | null) {
  cardAuthToken = token
    ? token.startsWith('Bearer ')
      ? token
      : `Bearer ${token}`
    : null
}

export function getCardAuthToken(): string | null {
  return cardAuthToken
}

export function clearCardAuthToken() {
  cardAuthToken = null
}

export type APIError = {
  status?: number
  code?: string
  message: string
  details?: unknown
}

function toAPIError(error: unknown): APIError {
  if (isAxiosError(error)) {
    const err = error as AxiosError<any>
    const status = err.response?.status
    const data = err.response?.data
    const code =
      (data && (data.code || data.error?.code)) || err.code || undefined

    // Tratamento específico para timeouts
    if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
      return {
        status,
        code: 'TIMEOUT',
        message:
          'Tempo limite excedido. Verifique sua conexão com a internet e tente novamente.',
        details: data,
      }
    }

    // Tratamento para problemas de conexão
    if (
      err.code === 'ECONNREFUSED' ||
      err.code === 'NETWORK_ERROR' ||
      err.code === 'ERR_NETWORK'
    ) {
      return {
        status,
        code: 'CONNECTION_ERROR',
        message:
          'Não foi possível conectar ao servidor NestJS. Verifique se o servidor está rodando na porta 3000',
        details: data,
      }
    }

    const message =
      (data && (data.message || data.error?.message)) ||
      err.message ||
      'Erro inesperado'
    return { status, code, message, details: data }
  }
  return { message: (error as Error)?.message || 'Erro inesperado' }
}

export function isUnauthorized(error: unknown) {
  return isAxiosError(error) && (error as AxiosError).response?.status === 401
}

const api = axios.create({
  baseURL,
  timeout: 30000, // Aumentado para 30 segundos
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

// Log da URL sendo usada para debug
console.log(`🌐 API Base URL: ${baseURL}`)

api.interceptors.request.use(
  async (config) => {
    const token = getAuthToken()

    if (token) {
      config.headers.set('Authorization', token)
    }

    const cardToken = getCardAuthToken()
    if (cardToken) {
      config.headers.set('authorization_card', cardToken)
    }

    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isUnauthorized(error)) {
      clearAuthToken()
    }
    return Promise.reject(toAPIError(error))
  }
)

export default api
