import { TransactionSchema } from "../types/transactionTypes/transactionsSchemaType.js";
import type { Transaction, CreateTransactionInput } from "../types/transactionTypes/transactionsSchemaType.js"
import { transactionsTable } from "@ledger/database/schema";

export const toTransaction = (transaction: typeof transactionsTable.$inferSelect): Transaction => {
    const transformedTransaction = TransactionSchema.parse({
        ...transaction,
        amount: Number(transaction.amount)
    });

    return transformedTransaction;
};

export const toTransactionEntry = (transactionInput: CreateTransactionInput): typeof transactionsTable.$inferInsert => {
    return {
        accountId: transactionInput.accountId,
        destinationAccountId: transactionInput.destinationAccountId,
        amount: String(transactionInput.amount),
        description: transactionInput.description,
        date: transactionInput.date,
    }
};