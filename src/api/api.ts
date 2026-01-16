import axios from 'axios'
import Constants from 'expo-constants'
import { DEV_API_BASE_URL, PROD_API_BASE_URL } from 'src/utils/constants'

const environment = Constants.expoConfig?.extra?.ENVIRONMENT || 'development'

const getAPIBaseURL = () => {
  if (environment === 'production') {
    return PROD_API_BASE_URL
  }

  return DEV_API_BASE_URL
}

const API_BASE_URL = getAPIBaseURL()

let authToken: string | null = null
let cardAuthToken: string | null = null

export function setAuthToken(token: string | null) {
  authToken = token
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
}

export function getCardAuthToken(): string | null {
  return cardAuthToken
}

export function clearCardAuthToken() {
  cardAuthToken = null
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  async (config: any) => {
    const token = getAuthToken()
    const cardToken = getCardAuthToken()

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    if (cardToken) {
      config.headers.authorization_card = `Bearer ${cardToken}`
    }

    return config
  },
  (error: any) => Promise.reject(error)
)

api.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    if (error.response?.status === 401) {
      clearAuthToken()
      clearCardAuthToken()
    }
    return Promise.reject(error)
  }
)

export default api
