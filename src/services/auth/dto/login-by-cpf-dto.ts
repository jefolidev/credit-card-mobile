export interface LoginByCpfDTO {
  userCpf?: string
  userCnpj?: string
  password: string
}

export interface LoginResponseDTO {
  id: string
  email: string
  role: 'SELLER' | 'PORTATOR' | 'ADMIN' | 'SUPER_ADMIN'
  name: string
}
