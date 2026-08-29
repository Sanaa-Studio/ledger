import * as z from "zod";
import { TransactionSchema } from "./transactionsSchemaType.js";

export const TransactionResponseSchema = z.object({
  data: TransactionSchema,
});

export const TransactionsResponseSchema = z.object({
  data: z.array(TransactionSchema),
  meta: z.object({
    page: z.number().int().positive(),
    limit: z.number().int().positive(),
    total: z.number().int().nonnegative(),
    pages: z.number().int().nonnegative(),
  }),
});
