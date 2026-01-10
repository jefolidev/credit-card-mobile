export const getErrorMessage = (err: any): string => {
  const status = err?.response?.status
  const isNetworkError =
    err?.message?.includes('Network Error') || err?.code === 'NETWORK_ERROR'

  const errorMessages: Record<number, string> = {
    404: 'Nenhum cartão foi encontrado com os dados informados.',
    400: 'Dados inválidos. Verifique as informações e tente novamente.',
    422: err?.response?.data?.message || 'Dados fornecidos são inválidos.',
  }

  if (isNetworkError)
    return 'Erro de conexão. Verifique sua internet e tente novamente.'
  if (status >= 500)
    return 'Erro interno do servidor. Tente novamente em alguns minutos.'
  if (errorMessages[status]) return errorMessages[status]

  return (
    err?.response?.data?.message ||
    err?.message ||
    'Não foi possível realizar a consulta. Tente novamente.'
  )
}
