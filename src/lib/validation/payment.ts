import { z } from 'zod';

export const paymentLookupSchema = z.object({
  identifier: z
    .string({
      required_error: 'Identifier is required',
    })
    .trim()
    .min(1, 'Please provide a valid UTR, Payment ID, or Order ID.'),
});

export type PaymentLookupInput = z.infer<typeof paymentLookupSchema>;

export const paymentIdSchema = z.object({
  id: z
    .string({
      required_error: 'Payment ID is required',
    })
    .trim()
    .min(1, 'Payment ID cannot be empty'),
});
