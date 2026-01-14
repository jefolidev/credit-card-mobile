export interface LoginByCPFDTO {
  cpf: string
  password: string
}

export interface LoginByCNPJDTO {
  cnpj?: string
  cpf?: string
  password: string
}

export interface LoginByDocumentDTO {
  document: string
  password: string
}
