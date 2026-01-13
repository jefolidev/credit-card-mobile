import api from '../../api/api'
import { LoginByCNPJDTO, LoginByCPFDTO } from './dto/login-by-cpf-dto'
import { GetMeResponse, LoginResponse } from './responses.dto'

export const authServices = {
  login: async (payload: LoginByCPFDTO): Promise<LoginResponse> => {
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

  cnpjLogin: async (payload: LoginByCNPJDTO): Promise<LoginResponse> => {
    try {
      if (!payload.cnpj) {
        throw new Error('CNPJ é obrigatório para login de lojistas')
      }

      const { data } = await api.post<LoginResponse>(`/sessions/login/cnpj`, {
        cnpj: payload.cnpj,
        password: payload.password,
      })
      return data
    } catch (error: any) {
      console.error('Erro no login por CNPJ:', {
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
