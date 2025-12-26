import axios, { AxiosError, isAxiosError } from 'axios'
import { Platform } from 'react-native'

// Base URL dinâmica por ambiente/plataforma
const baseURL =
  (process.env.EXPO_PUBLIC_API_BASE_URL || '').trim() ||
  Platform.select({
    ios: 'http://localhost:3000',
    android: 'http://10.0.2.2:3000',
  }) ||
  'http://localhost:3000'

let authToken: string | null = null

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
    const message =
      (data && (data.message || data.error?.message)) ||
      err.message ||
      'Unexpected error'
    return { status, code, message, details: data }
  }
  return { message: (error as Error)?.message || 'Unexpected error' }
}

export function isUnauthorized(error: unknown) {
  return isAxiosError(error) && (error as AxiosError).response?.status === 401
}

const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  async (config) => {
    const token = getAuthToken()
    if (token) {
      config.headers.set('Authorization', token)
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
