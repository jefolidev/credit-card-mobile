import api from '../../api/api'
import { LoginByCNPJDTO, LoginByCPFDTO } from './dto/login-by-cpf-dto'
import { GetMeResponse, LoginResponse } from './responses.dto'

export const authServices = {
  cpfLogin: async (payload: LoginByCPFDTO): Promise<LoginResponse> => {
    try {
      const { data } = await api.post<LoginResponse>(`/sessions/login/cpf`, {
        cpf: payload.cpf,
        password: payload.password,
      })
      return data
    } catch (error: any) {
      console.error('Erro no login por CPF:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method,
        payload: error.config?.data,
      })
      throw error
    }
  },

  sellerLogin: async (payload: LoginByCNPJDTO): Promise<LoginResponse> => {
    try {
      if (!payload.cnpj && !payload.cpf) {
        throw new Error('CPF ou CNPJ é obrigatório para login de lojistas')
      }

      // Detecta se é CPF ou CNPJ baseado no documento fornecido
      const document = payload.cnpj || payload.cpf || ''
      const cleanDocument = document.replace(/\D/g, '')
      const isCPF = cleanDocument.length === 11

      const requestPayload = {
        ...(isCPF ? { cpf: document } : { cnpj: document }),
        password: payload.password,
      }

      // Usa endpoint diferente baseado no tipo de documento
      const endpoint = isCPF ? '/sessions/login/cpf' : '/sessions/login/cnpj'

      const { data } = await api.post<LoginResponse>(endpoint, requestPayload)
      return data
    } catch (error: any) {
      console.error('Erro no login de lojista:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method,
        payload: error.config?.data,
      })
      throw error
    }
  },

  getMe: async (): Promise<GetMeResponse> => {
    const { data } = await api.get(`/sessions/me`)

    return data
  },

  meLogout: async (): Promise<void> => {
    await api.post(`/sessions/logout`)
  },
}
