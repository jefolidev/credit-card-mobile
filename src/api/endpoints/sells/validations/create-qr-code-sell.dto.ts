import z from "zod";

const createQrCodeSellDto = z.object({
  description: z.string('Informe a descrição da venda'),
  amount: z
    .number('Informe o valor da venda')
    .positive('O valor da venda deve ser positivo'),
  installments: z
    .number('Informe o número de parcelas')
    .int('O número de parcelas deve ser um número inteiro')
    .positive('O número de parcelas deve ser positivo'),
});

export { createQrCodeSellDto };
export type CreateQrCodeSellDto = z.infer<typeof createQrCodeSellDto>;
