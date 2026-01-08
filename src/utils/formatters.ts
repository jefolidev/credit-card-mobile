/**
 * Format currency input for Brazilian Real
 */
export const formatCurrency = (value: string): string => {
  const numericValue = value.replace(/[^\d]/g, '')
  const numberValue = parseInt(numericValue || '0') / 100
  return numberValue.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

/**
 * Format number to currency string
 */
export const formatNumberToCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

/**
 * Parse currency string to number
 */
export const parseCurrencyToNumber = (currency: string): number => {
  const numericValue = currency.replace(/[^\d]/g, '')
  return parseInt(numericValue || '0') / 100
}

/**
 * Format card number with spaces
 */
export const formatCardNumber = (value: string): string => {
  const numericValue = value.replace(/[^\d]/g, '')
  const formattedValue = numericValue.replace(/(\d{4})(?=\d)/g, '$1 ')
  return formattedValue.slice(0, 19) // Limit to 16 digits with spaces
}

/**
 * Calculate installment value
 */
export const calculateInstallmentValue = (
  totalValue: number,
  installments: number
): number => {
  return totalValue / installments
}
