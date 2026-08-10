import { CreateTransactionSchema } from "../types/transactionsSchemaType.js";
import type { Response, Request } from "express";
import {
  fetchTransactions,
  fetchTransaction,
  makeTransaction,
  removeTransaction,
} from "../services/transactionsService.js";

// GET
export const getTransactions = (req: Request, res: Response) => {
  const transactions = fetchTransactions();
  res.json(transactions);
};

export const getTransaction = (req: Request, res: Response) => {
  const transactionId = Number(req.params.id);
  const transaction = fetchTransaction(transactionId);

  if (!transaction) {
    return res.status(404).end();
  }

  return res.status(200).json(transaction);
};

// POST
export const createTransaction = (req: Request, res: Response) => {
  const transactionInput = CreateTransactionSchema.safeParse(req.body);

  if (!transactionInput.success) {
    return res.status(400).json({
      error: "Invalid transaction data",
      details: transactionInput.error.issues,
    });
  }

  const transaction = makeTransaction(transactionInput.data);
  return res.status(201).json(transaction);
};

// DELETE
export const deleteTransaction = (req: Request, res: Response) => {
  const transactionId = Number(req.params.id);
  removeTransaction(transactionId);

  return res.status(204).end();
};
