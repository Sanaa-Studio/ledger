import {
  CreateTransactionInput,
  UpdateTransactionInput,
  Transaction,
} from "../types/transactionTypes/transactionsSchemaType.js";
import { BadRequestError, NotFoundError } from "../errors/AppError.js";
import type { TransactionQuery } from "../types/transactionTypes/transactionQuerySchema.js";
import type { TransactionQueryResponse } from "../types/transactionTypes/transactionQueryResponseType.js";
import { 
    getTransaction, 
    getTransactions, 
    getTransactionsCount, 
    postTransaction, 
    putTransaction,
    updateTransaction,
    deleteTransaction 
} from "../repository/transactionsRepository.js";
import { getAccount } from "../repository/accountsRepository.js";

const validateTransactionAccounts = async (
  accountId: number,
  destinationAccountId?: number | null,
): Promise<void> => {
  if (
    destinationAccountId !== undefined &&
    destinationAccountId !== null &&
    accountId === destinationAccountId
  ) {
    throw new BadRequestError(
      "Origin and destination accounts cannot be the same",
    );
  }

  const sourceAccount = await getAccount(accountId);

  if (!sourceAccount) {
    throw new BadRequestError("Origin account does not exist");
  }

  if (
    destinationAccountId !== undefined &&
    destinationAccountId !== null
  ) {
    const destinationAccount = await getAccount(destinationAccountId);

    if (!destinationAccount) {
      throw new BadRequestError("Destination account does not exist");
    }
  }
};

// GET
export const fetchTransactions = async(query: TransactionQuery): Promise<TransactionQueryResponse> => {
    const {page, limit} = query;
    const startIndex =  (page - 1) * limit;

    const [total, paginatedTransactions] = await Promise.all(
        [
            getTransactionsCount(),
            getTransactions(startIndex, limit)
        ]
    );

    const response: TransactionQueryResponse = {
        page,
        limit,
        total: total,
        pages: Math.ceil(total / limit),
        data: paginatedTransactions
    };

  return response;
};

export const fetchTransaction = async (transactionId: number) => {
  const transaction = await getTransaction(transactionId);

  if (!transaction) {
    throw new NotFoundError("Transaction does not exist");
  }

  return transaction;
};

//POST
export const makeTransaction = async (input: CreateTransactionInput): Promise<Transaction> => {
    const sourceAccount = await getAccount(input.accountId);

    if (!sourceAccount) {
        throw new BadRequestError("Origin account does not exist");
    }

    if (input.accountId === input.destinationAccountId) {
      throw new BadRequestError(
        "Origin and desitination accounts cannot be the same",
      );
    }

    if (input.destinationAccountId) {
        const destinationAccount =
            await getAccount(input.destinationAccountId);

        if (!destinationAccount) {
            throw new BadRequestError(
            "Destination account does not exist"
            );
        }
    }

  return postTransaction(input);
};

// PUT 
export const replaceTransaction = async (
  input: CreateTransactionInput,
  id: number,
): Promise<Transaction> => {
  const existingTransaction = await getTransaction(id);

  if (!existingTransaction) {
    throw new NotFoundError("Transaction does not exist");
  }

  await validateTransactionAccounts(
    input.accountId,
    input.destinationAccountId,
  );

  const updatedTransaction = await putTransaction(id, input);

  if (!updatedTransaction) {
    throw new NotFoundError("Transaction does not exist");
  }

  return updatedTransaction;
};

// PATCH
export const patchTransaction = async (
  input: UpdateTransactionInput,
  id: number,
): Promise<Transaction> => {
  const existingTransaction = await getTransaction(id);

  if (!existingTransaction) {
    throw new NotFoundError("Transaction does not exist");
  }

  const accountId =
    input.accountId ?? existingTransaction.accountId;

  const destinationAccountId =
    input.destinationAccountId !== undefined
      ? input.destinationAccountId
      : existingTransaction.destinationAccountId;

  await validateTransactionAccounts(
    accountId,
    destinationAccountId,
  );

  const updatedTransaction = await updateTransaction(id, input);

  if (!updatedTransaction) {
    throw new NotFoundError("Transaction does not exist");
  }

  return updatedTransaction;
};

// DELETE
export const removeTransaction = async (id: number): Promise<Transaction> => {
  const deletedTransaction = await deleteTransaction(id);

  if (!deletedTransaction) {
    throw new NotFoundError("Failed to retrieve deleted transaction");
  }
  return deletedTransaction;
};
