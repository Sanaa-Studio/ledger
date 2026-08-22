import { transactionsTable } from "@ledger/database/schema";
import type { CreateTransactionInput, UpdateTransactionInput, Transaction } from "@ledger/contracts";
import { db } from "../db/db.js";
import { toTransaction, toTransactionEntry } from "../mappers/transactionMapper.js";
import { eq, count, desc } from "drizzle-orm";

// GET
export const getTransactions = async (startIndex: number, limit: number): Promise<Transaction[]> => {
    const transactions = await db
        .select()
        .from(transactionsTable)
        .orderBy(
            desc(transactionsTable.date),
            desc(transactionsTable.id),
        )
        .offset(startIndex)
        .limit(limit)

    return transactions.map(toTransaction);
};

export const getTransaction = async (id: number): Promise<Transaction | undefined > => {
    const [transaction] = await db
        .select()
        .from(transactionsTable)
        .where(eq(transactionsTable.id, id));
    
    return transaction ? toTransaction(transaction) : undefined;
};

export const getTransactionsCount = async() => {
    const transactionsCount = await db
        .select({ count: count() })
        .from(transactionsTable);
    
    return transactionsCount[0]?.count ?? 0;
};

// POST
export const postTransaction = async (transactionInput: CreateTransactionInput): Promise<Transaction > => {
    const transformedTransaction = toTransactionEntry(transactionInput);

    const [insertedTransaction] = await db
        .insert(transactionsTable)
        .values(transformedTransaction)
        .returning();

    if (!insertedTransaction){
        throw new Error("Database failed to return created transaction");
    };
 
    return toTransaction(insertedTransaction);
};

// PUT
export const putTransaction = async (
  id: number,
  input: CreateTransactionInput,
): Promise<Transaction | undefined> => {
  const [updatedTransaction] = await db
    .update(transactionsTable)
    .set({
      accountId: input.accountId,
      destinationAccountId: input.destinationAccountId ?? null,
      amount: String(input.amount),
      description: input.description ?? null,
      date: input.date,
    })
    .where(eq(transactionsTable.id, id))
    .returning();

  return updatedTransaction
    ? toTransaction(updatedTransaction)
    : undefined;
};

// PATCH
// PATCH
export const updateTransaction = async (
  id: number,
  input: UpdateTransactionInput,
): Promise<Transaction | undefined> => {
  const [updatedTransaction] = await db
    .update(transactionsTable)
    .set({
      accountId: input.accountId,
      destinationAccountId: input.destinationAccountId,
      amount:
        input.amount !== undefined
          ? String(input.amount)
          : undefined,
      description: input.description,
      date: input.date,
    })
    .where(eq(transactionsTable.id, id))
    .returning();

  return updatedTransaction
    ? toTransaction(updatedTransaction)
    : undefined;
};

// DELETE
export const deleteTransaction = async(id: number): Promise<Transaction | undefined> => {
    const [deletedTransaction] = await db
        .delete(transactionsTable)
        .where(eq(transactionsTable.id, id))
        .returning();
    
    return deletedTransaction ? toTransaction(deletedTransaction): undefined;
};
