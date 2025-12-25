export const applyCpfMask = (cpf: string | undefined | null): string => {
  if (!cpf) return '---.---.---/--'

  // Remove todos os caracteres não numéricos e limita a 11 dígitos
  const cleanedCpf = cpf.replace(/\D/g, '').slice(0, 11)

  // Se não tem 11 dígitos, retorna formatação parcial
  if (cleanedCpf.length < 11) {
    return cleanedCpf.replace(
      /(\d{3})(\d{0,3})(\d{0,3})(\d{0,2})/,
      (_, p1, p2, p3, p4) => {
        let result = p1
        if (p2) result += '.' + p2
        if (p3) result += '.' + p3
        if (p4) result += '-' + p4
        return result
      }
    )
  }

  // Formatação completa para CPFs com 11 dígitos
  return cleanedCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

export const cleanCpf = (cpf: string): string => {
  return cpf.replace(/\D/g, '')
}
