export function applyCnpjMask(value: string): string {
  const numericValue = value.replace(/\D/g, '')

  return numericValue
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1')
}

export function cleanCnpj(cnpj: string): string {
  return cnpj.replace(/\D/g, '')
}
