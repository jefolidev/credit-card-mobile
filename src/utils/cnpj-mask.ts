export function applyCnpjMask(value: string): string {
  // Remove todos os caracteres não numéricos
  const numericValue = value.replace(/\D/g, '')

  // Aplica a máscara de CNPJ: 00.000.000/0000-00
  return numericValue
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1')
}

export function cleanCnpj(cnpj: string): string {
  // Remove todos os caracteres não numéricos
  return cnpj.replace(/\D/g, '')
}
