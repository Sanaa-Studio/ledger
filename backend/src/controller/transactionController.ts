import { CreateTransactionSchema, UpdateTransactionSchema } from "@ledger/contracts";
import type { Response, Request } from "express";
import {
  fetchTransactions,
  fetchTransaction,
  makeTransaction,
  removeTransaction,
  patchTransaction,
  replaceTransaction
} from "../services/transactionsService.js";
import { TransactionQuerySchema } from "@ledger/contracts";
import { ValidationError } from "../errors/AppError.js";

// GET
export const getTransactions = async (req: Request, res: Response) => {
  const query = TransactionQuerySchema.safeParse(req.query);

  if (!query.success){
    throw new ValidationError("Invalid transaction data", query.error.issues);
  };

  const transactions = await fetchTransactions(query.data);

  const response = {
    data: transactions.data,
    meta: {
        page: transactions.page,
        limit: transactions.limit,
        total: transactions.total,
        pages: transactions.pages
    }
  };

  res.status(200).json(response);
};

export const getTransaction = async (req: Request, res: Response) => {
  const transactionId = Number(req.params.id);
  const transaction = await fetchTransaction(transactionId);

  const response = {
    data: transaction
  };

  return res.status(200).json(response);
};

// POST
export const createTransaction = async (req: Request, res: Response) => {
  const transactionInput = CreateTransactionSchema.safeParse(req.body);

  if (!transactionInput.success) {
    throw new ValidationError("Invalid transaction data", transactionInput.error.issues)
  };

  const transaction = await makeTransaction(transactionInput.data);

  const response = {
    data: transaction
  }

  return res.status(201).json(response);
};

// PUT 
export const putTransaction = async (
  req: Request,
  res: Response,
) => {
  const transactionId = Number(req.params.id);
  const result = CreateTransactionSchema.safeParse(req.body);

  if (!result.success) {
    throw new ValidationError(
      "Invalid transaction data",
      result.error.issues,
    );
  }

  const transaction = await replaceTransaction(
    result.data,
    transactionId,
  );

  return res.status(200).json({
    data: transaction,
  });
};

// PATCH
export const updateTransaction = async (
  req: Request,
  res: Response,
) => {
  const transactionId = Number(req.params.id);
  const result = UpdateTransactionSchema.safeParse(req.body);

  if (!result.success) {
    throw new ValidationError(
      "Invalid transaction data",
      result.error.issues,
    );
  }

  const transaction = await patchTransaction(
    result.data,
    transactionId,
  );

  return res.status(200).json({
    data: transaction,
  });
};

// DELETE
export const deleteTransaction = async (req: Request, res: Response) => {
  const transactionId = Number(req.params.id);
  await removeTransaction(transactionId);
 
  return res.status(204).send()
};
