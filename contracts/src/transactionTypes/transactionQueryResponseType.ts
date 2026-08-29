import type { Transaction } from "./transactionsSchemaType.js";

export type TransactionQueryResponse = {
  page: number;
  limit: number;
  total: number;
  pages: number;
  data: Transaction[];
};
