import * as z from "zod";

export const CreateTransactionSchema = z.object({
  accountId: z.number().positive().int(),
  destinationAccountId: z.number().positive().int().optional(),
  amount: z.number(),
  description: z.string().optional(),
  date: z.coerce.date().min(new Date("1900-01-01")).max(new Date("2100-01-01")),
});

export const TransactionSchema = CreateTransactionSchema.extend({
  id: z.number().int().positive(),
});

export type CreateTransactionInput = z.infer<typeof CreateTransactionSchema>;
export type Transaction = z.infer<typeof TransactionSchema>;
