import api from "../../api";
import LoginByCpfDTO from "./dto/login-by-cpf-dto";
import { GetMeResponse, LoginResponse } from "./responses.dto";

const loginByCpf = async (payload: LoginByCpfDTO): Promise<LoginResponse> => {
  const {data} = await api.post<LoginResponse>('/sessions/login-by-cpf', payload);
  return data;
}

const getMe = async (): Promise<GetMeResponse> => {
  const {data} = await api.get(`/sessions/me/`);

  return data;
}

const meLogout = async ():Promise<void> => {
  await api.post(`/sessions/logout/`);
}

export {
  loginByCpf,
  getMe,
  meLogout
}