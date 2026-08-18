import * as z from "zod";

export const TransactionQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10)
})

export type TransactionQuery = z.infer<typeof TransactionQuerySchema>;
