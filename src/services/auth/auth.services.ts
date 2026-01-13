import api from '../../api/api'
import { LoginDTO, LoginResponseDTO } from './dto/login-by-cpf-dto'
import { GetMeResponse, LoginResponse } from './responses.dto'

export const authServices = {
  login: async (payload: LoginDTO): Promise<LoginResponse> => {
    if (!payload.userCpf) {
      throw new Error('CPF é obrigatório para login de portadores')
    }

    const queryParams = `cpf=${payload.userCpf}`

    const getUserResponse = await api.get<LoginResponseDTO[]>(
      `/sessions/login/all?${queryParams}`
    )

    const user = getUserResponse.data[0]

    if (!user || !user.id) {
      throw new Error('Usuário não encontrado ou ID não retornado pela API')
    }

    const { data } = await api.post<LoginResponse>(`/sessions/login`, {
      id: user.id,
      password: payload.password,
    })

    return data
  },

  cnpjLogin: async (payload: LoginDTO): Promise<LoginResponse> => {
    if (!payload.userCnpj) {
      throw new Error('CNPJ é obrigatório para login de lojistas')
    }

    const { data } = await api.post<LoginResponse>(`/sessions/login/cnpj`, {
      cnpj: payload.userCnpj,
      password: payload.password,
    })

    return data
  },

  getMe: async (): Promise<GetMeResponse> => {
    const { data } = await api.get(`/sessions/me`)

    return data
  },

  meLogout: async (): Promise<void> => {
    await api.post(`/sessions/logout`)
  },
}
