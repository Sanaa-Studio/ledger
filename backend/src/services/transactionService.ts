import { getTransactions, setTransactions } from "../datastore/transactions.js";
import { getAccounts } from "../datastore/accounts.js";
import { CreateTransactionInput, Transaction } from "../types/transaction.js";
import { generateId } from "./generateId.js";
import { NotFoundError } from "../errors/AppError.js";

// GET
export const fetchTransactions = () => {
  return getTransactions();
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
      throw new NotFoundError(
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
