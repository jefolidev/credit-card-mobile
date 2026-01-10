import api from '../../api/api'
import { LoginDTO, LoginResponseDTO } from './dto/login-by-cpf-dto'
import { GetMeResponse, LoginResponse } from './responses.dto'

export const authServices = {
  login: async (payload: LoginDTO): Promise<LoginResponse> => {
    let queryParams = ''

    if (payload.userCnpj) {
      queryParams = `cnpj=${payload.userCnpj}`
    }

    if (payload.userCpf) {
      queryParams = `cpf=${payload.userCpf}`
    }

    const getUserResponse = await api.get<LoginResponseDTO[]>(
      `/sessions/login/all?${queryParams}`
    )

    // A API retorna um array, então pegamos o primeiro usuário
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

  getMe: async (): Promise<GetMeResponse> => {
    const { data } = await api.get(`/sessions/me`)

    return data
  },

  meLogout: async (): Promise<void> => {
    await api.post(`/sessions/logout`)
  },
}
