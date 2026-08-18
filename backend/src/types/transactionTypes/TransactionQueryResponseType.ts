import type { Transaction } from "./transactionsSchemaType.js";

export type TransactionQueryResponse = {
    page: number,
    limit: number,
    totalTransactions: number,
    pages: number,
    data: Transaction[]
};