import type { Transaction } from "../types/transaction.js";

export let transactions: Transaction[] = [
  {
    id: 1,
    accountId: 1,
    amount: -85.42,
    description: "Groceries",
    date: new Date("2026-07-02"),
  },
  {
    id: 2,
    accountId: 1,
    amount: 2500,
    description: "Paycheck",
    date: new Date("2026-07-05"),
  },
  {
    id: 3,
    accountId: 3,
    amount: -64.99,
    description: "Internet bill",
    date: new Date("2026-07-08"),
  },
  {
    id: 4,
    accountId: 4,
    amount: -18.5,
    description: "Lunch",
    date: new Date("2026-07-10"),
  },
  {
    id: 5,
    accountId: 1,
    destinationAccountId: 2,
    amount: -500,
    description: "Transfer to savings",
    date: new Date("2026-07-12"),
  },
  {
    id: 6,
    accountId: 2,
    amount: 500,
    description: "Transfer from checking",
    date: new Date("2026-07-12"),
  },
  {
    id: 7,
    accountId: 3,
    amount: -142.37,
    description: "Flight",
    date: new Date("2026-07-15"),
  },
  {
    id: 8,
    accountId: 1,
    amount: -52.16,
    description: "Gas",
    date: new Date("2026-07-19"),
  },
  {
    id: 9,
    accountId: 5,
    amount: 325.8,
    description: "Investment gain",
    date: new Date("2026-07-23"),
  },
  {
    id: 10,
    accountId: 4,
    amount: -7.25,
    date: new Date("2026-07-25"),
  },
  {
    id: 11,
    accountId: 1,
    amount: -127.49,
    description: "Utilities",
    date: new Date("2026-08-01"),
  },
  {
    id: 12,
    accountId: 2,
    destinationAccountId: 5,
    amount: -1000,
    description: "Transfer to investment account",
    date: new Date("2026-08-03"),
  },
];

export const getTransactions = () => {
  return transactions;
};

export const setTransactions = (newTransactions: Transaction[]) => {
  transactions = newTransactions;
};
