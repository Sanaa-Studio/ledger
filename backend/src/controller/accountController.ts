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
} from "../types/accountsSchemaType.js";

// GET
export const getAccounts = (req: Request, res: Response) => {
  console.log(req.path);
  res.json(fetchAccounts());
};

export const getAccountById = (req: Request, res: Response) => {
  const accountId = req.params.id;
  const account = fetchAccount(String(accountId));

  res.json(account);
};

// POST
export const postAccount = (req: Request, res: Response) => {
  const result = CreateAccountSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "invalid account data",
      details: result.error.issues,
    });
  }

  const account = createAccount(result.data);
  return res.status(201).json(account);
};

// PUT
export const putAccount = (req: Request, res: Response) => {
  const result = CreateAccountSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid account data",
      details: result.error.issues,
    });
  }

  const accountId = Number(req.params.id);
  const account = replaceAccount(result.data, accountId);

  return res.status(200).json(account);
};

// PATCH
export const updateAccount = (req: Request, res: Response) => {
  const accountId = Number(req.params.id);
  const result = UpdateAccountSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid account info",
      details: result.error.issues,
    });
  }

  const account = patchAccount(result.data, accountId);
  return res.status(200).json(account);
};

// DELETE
export const deleteAccount = (req: Request, res: Response) => {
  const accountId = Number(req.params.id);
  removeAccount(accountId);

  return res.status(200).end();
};
