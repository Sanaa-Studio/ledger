import { getTransactions, setTransactions } from "../datastore/transactions.js";
import { getAccounts } from "../datastore/accounts.js";
import { CreateTransactionInput, Transaction } from "../types/transaction.js";
import { generateId } from "./generateId.js";

// GET
export const fetchTransactions = () => {
    return getTransactions();
}

export const fetchTransaction = (transactionId: number) => {
    const transactions = getTransactions();

    const transaction = transactions.find((transaction) => 
        transaction.id === transactionId);

    return transaction;
}

//POST
export const makeTransaction = (input: CreateTransactionInput) : Transaction | undefined => {
    const transactions = getTransactions();
    const accounts = getAccounts();
    const currentMaxId = transactions.length === 0 ?
        0
        : Math.max(...transactions.map((transaction) => transaction.id));

    const destinationAccountId = input.destinationAccountId;
    const originExists = accounts.some((account) => account.id === input.accountId);
    const destinationExists = accounts.some((account) => account.id === destinationAccountId);

    if (!originExists){
        return undefined;
    }

    if (destinationAccountId !== undefined && !destinationExists){
        return undefined;
    }

    if (input.accountId === destinationAccountId){
        return undefined;
    }

    const transaction: Transaction = {
        id: generateId(currentMaxId),
        ...input,
    }

    setTransactions([...transactions, transaction]);

    return transaction;
}

// DELETE
export const removeTransaction = (id: number): boolean => {
    const transactions = getTransactions();
    const filteredTransactions = transactions.filter((transaction) => transaction.id !== id);

    if (transactions.length === filteredTransactions.length){
        return false;
    }

    setTransactions(filteredTransactions);
    return true;
}
