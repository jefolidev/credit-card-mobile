import z from "zod";

const createSellDto = z.object({
  description: z.string('Descrição é obrigatória').min(1, 'Descrição é obrigatória'),
  amount: z.number('Valor é obrigatório').min(0.01, 'O valor deve ser no mínimo 0,01'),
  installments: z.number('Número de parcelas é obrigatório').min(1, 'O número de parcelas deve ser no mínimo 1'),
  cardNumber: z.string("Número do cartão é obrigatório").min(16, 'Número do cartão inválido').max(16, 'Número do cartão inválido'),
  cardPassword: z.string("Senha do cartão é obrigatória").min(4, 'Senha do cartão inválida').max(4, 'Senha do cartão inválida'),
})

export type CreateSellDto = z.infer<typeof createSellDto>;
export { createSellDto };
