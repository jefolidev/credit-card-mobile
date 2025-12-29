import z from "zod";

const getLimitDto = z.object({
  cardId: z.uuid().optional(),
  cardNumber: z.string().length(16, "O número do cartão deve ter 16 dígitos").optional(),
  password: z.string().min(4, "A senha deve ter no mínimo 4 caracteres")
}).refine((data) => data.cardId || data.cardNumber, {
  message: "É necessário fornecer o ID do cartão ou o número do cartão"
});

export type GetLimitDto = z.infer<typeof getLimitDto>;
export { getLimitDto };
