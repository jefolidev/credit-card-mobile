import z from 'zod';

const confirmCancellationDto = z.object({
  confirm: z.boolean().refine((val) => val === true, {
    message: 'Você deve confirmar o cancelamento da venda',
  }),
});

export type ConfirmCancellationDto = z.infer<typeof confirmCancellationDto>;
export { confirmCancellationDto };
