import {
  getTransactions,
  setTransactions,
} from "../datastore/transactionsData.js";
import { getAccounts } from "../datastore/accountsData.js";
import {
  CreateTransactionInput,
  Transaction,
} from "../types/transactionTypes/transactionsSchemaType.js";
import { generateId } from "../utils/generateId.js";
import { BadRequestError, NotFoundError } from "../errors/AppError.js";
import type { TransactionQuery } from "../types/transactionTypes/transactionQuerySchema.js";
import type { TransactionQueryResponse } from "../types/transactionTypes/transactionQueryResponseType.js";

// GET
export const fetchTransactions = (query: TransactionQuery): TransactionQueryResponse => {
    const transactions = getTransactions();
    const {page, limit} = query;

    const startIndex =  (page - 1) * limit;
    const endIndex = startIndex + limit;

    const totalTransactions = transactions.length;
    const paginatedTransactions = transactions.slice(startIndex,endIndex);

    const response: TransactionQueryResponse = {
        page,
        limit,
        totalTransactions: totalTransactions,
        pages: Math.ceil(totalTransactions / limit),
        data: paginatedTransactions
    };

  return response;
};

export const fetchTransaction = (transactionId: number) => {
  const transactions = getTransactions();

  const transaction = transactions.find(
    (transaction) => transaction.id === transactionId,
  );

  if (!transaction) {
    throw new NotFoundError("Transaction does not exist");
  }

  return transaction;
};

//POST
export const makeTransaction = (input: CreateTransactionInput): Transaction => {
  const transactions = getTransactions();
  const accounts = getAccounts();
  const currentMaxId =
    transactions.length === 0
      ? 0
      : Math.max(...transactions.map((transaction) => transaction.id));

  const destinationAccountId = input.destinationAccountId;
  const originExists = accounts.some(
    (account) => account.id === input.accountId,
  );

  if (!originExists) {
    throw new NotFoundError("Origin account does not exist");
  }

  if (input.destinationAccountId != undefined) {
    const destinationExists = accounts.some(
      (account) => account.id === destinationAccountId,
    );

    if (!destinationExists) {
      throw new NotFoundError("Destination account does not exist");
    }

    if (input.accountId === input.destinationAccountId) {
      throw new BadRequestError(
        "Origin and desitination accounts cannot be the same",
      );
    }
  }

  const transaction: Transaction = {
    id: generateId(currentMaxId),
    ...input,
  };

  setTransactions([...transactions, transaction]);

  return transaction;
};

// DELETE
export const removeTransaction = (id: number) => {
  const transactions = getTransactions();
  const filteredTransactions = transactions.filter(
    (transaction) => transaction.id !== id,
  );

  if (transactions.length === filteredTransactions.length) {
    throw new NotFoundError("Transaction does not exist");
  }

  setTransactions(filteredTransactions);
  return true;
};
