interface LoginBodyRequest {
  cpf: string
  password: string
}

export const authServices = {
  login: async (
    { cpf, password }: LoginBodyRequest,
    userType: 'client' | 'supplier'
  ) => {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        if (cpf === '12345678900' && password === '123456') {
          console.log(cpf, password, userType)

          resolve(true)
        } else {
          resolve(false)
        }
      }, 1000)
    })
  },
}
