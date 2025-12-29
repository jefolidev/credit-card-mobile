import { UserRole } from "./enum/user-role";

export type LoginResponse = {
  token: string;
}

export type GetMeResponse = {
  email: string;
  id: string;
  role: UserRole;
  name: string;
}