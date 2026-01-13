import axios from 'axios'
import { Platform } from 'react-native'

// Base URL baseada na plataforma
const getBaseURL = () => {
  if (Platform.OS === 'android') {
    return 'http://192.168.1.5:3001' 
  }
  return 'http://localhost:3001'
}

const API_BASE_URL = getBaseURL()

let authToken: string | null = null

export function setAuthToken(token: string | null) {
  authToken = token
}

export function getAuthToken(): string | null {
  return authToken
}

export function clearAuthToken() {
  authToken = null
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  async (config) => {
    const token = getAuthToken()
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthToken()
    }
    return Promise.reject(error)
  }
)

export default api
