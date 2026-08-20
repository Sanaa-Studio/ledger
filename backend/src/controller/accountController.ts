import {
  fetchAccounts,
  fetchAccount,
  createAccount,
  replaceAccount,
  patchAccount,
  removeAccount,
} from "../services/accountsService.js";
import { type Request, type Response } from "express";
import {
  CreateAccountSchema,
  UpdateAccountSchema,
} from "../types/accountTypes/accountsSchemaType.js";
import { AccountQuerySchema } from "../types/accountTypes/accountQuerySchema.js";

// GET
export const getAccounts = async (req: Request, res: Response) => {
  const query = AccountQuerySchema.safeParse(req.query);

  if (!query.success) {
    return res.status(400).json({
      error: "Invalid query parameters",
      details: query.error.issues,
    });
  }

  const response = await fetchAccounts(query.data);

  res.status(200).json(response);
};

export const getAccountById = async (req: Request, res: Response) => {
  const accountId = Number(req.params.id);
  const account = await fetchAccount(accountId);

  const response = {
    data: account
  };

  return res.status(200).json(response);
};

// POST
export const postAccount = async (req: Request, res: Response) => {
  const result = CreateAccountSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "invalid account data",
      details: result.error.issues,
    });
  }

  const account = await createAccount(result.data);
  
  const response = {
    data: account
  };

  return res.status(201).json(response);
};

// PUT
export const putAccount = async (req: Request, res: Response) => {
  const result = CreateAccountSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid account data",
      details: result.error.issues,
    });
  }

  const accountId = Number(req.params.id);
  const account = await replaceAccount(result.data, accountId);

  const response = {
    data: account
  }

  return res.status(200).json(response);
};

// PATCH
export const updateAccount = async (req: Request, res: Response) => {
  const accountId = Number(req.params.id);
  const result = UpdateAccountSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid account info",
      details: result.error.issues,
    });
  }

  const account = await patchAccount(result.data, accountId);

  const response  = {
    data: account
  };

  return res.status(200).json(response);
};

// DELETE
export const deleteAccount = async (req: Request, res: Response) => {
  const accountId = Number(req.params.id);
  const deletedAccount = await removeAccount(accountId);

  const response = {
    data: deletedAccount
  };

  return res.status(200).json(response);
};
