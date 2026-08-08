import { CreateTransactionSchema } from "../types/transaction.js";
import type { Response, Request } from 'express';
import {
    fetchTransactions,
    fetchTransaction,
    makeTransaction,
    removeTransaction
} from "../services/transactionService.js";

// GET
export const getTransactions = (req: Request, res: Response) => {
    const transactions = fetchTransactions();
    res.json(transactions);
}

export const getTransaction = (req: Request, res: Response) => {
    const transactionId = Number(req.params.id);
    const transaction = fetchTransaction(transactionId);

    if (!transaction){
        return res.status(404).end();
    }

    return res.json(transaction);
}

// POST
export const createTransaction = (req: Request, res: Response) => {
    const transactionInput = CreateTransactionSchema.safeParse(req.body);

    if (!transactionInput.success){
        return res.status(400).json(
            {
                error: "Invalid transaction data",
                details: transactionInput.error.issues
            }
        )
    }

    const transaction = makeTransaction(transactionInput.data);
    return res.status(201).json(transaction)
}

// DELETE
export const deleteTransaction = (req: Request, res: Response) => {
    const transactionId = Number(req.params.id);
    const deletedTransaction = removeTransaction(transactionId);

    if (!deletedTransaction){
        return res.status(404).json(
            {
                error: "Transaction does not exist"
            }
        )
    }

    return res.status(204).end();
}