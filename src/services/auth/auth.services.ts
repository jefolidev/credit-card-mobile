import api from '../../api/api'
import LoginByCpfDTO from './dto/login-by-cpf-dto'
import { GetMeResponse, LoginResponse } from './responses.dto'

export const authServices = {
  loginByCpf: async (payload: LoginByCpfDTO): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>(
      '/sessions/login/cpf',
      payload
    )

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
