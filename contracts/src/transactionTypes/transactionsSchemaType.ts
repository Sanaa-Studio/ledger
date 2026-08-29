import * as z from "zod";

export const CreateTransactionSchema = z.object({
  accountId: z.number().positive().int(),
  destinationAccountId: z.number().positive().int().optional(),
  amount: z.number(),
  description: z.string().optional(),
  date: z.coerce.date().min(new Date("1900-01-01")).max(new Date("2100-01-01")),
});

export const UpdateTransactionSchema = CreateTransactionSchema.partial()
  .extend({
    destinationAccountId: z.number().positive().int().nullable().optional(),
    description: z.string().nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export const TransactionSchema = CreateTransactionSchema.extend({
  id: z.number().int().positive(),
  destinationAccountId: z.number().positive().int().nullable(),
  description: z.string().nullable(),
});

export type CreateTransactionInput = z.infer<typeof CreateTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof UpdateTransactionSchema>;
export type Transaction = z.infer<typeof TransactionSchema>;
