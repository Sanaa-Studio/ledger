import type {
  Account,
  CreateAccountInput,
  UpdateAccountInput,
  AccountQuery,
  AccountQueryResponseType,
} from "@ledger/contracts";
import { NotFoundError, ConflictError } from "../errors/AppError.js";
import {
  getAccounts,
  getAccount,
  getAccountsCount,
  findAccount,
  postAccount,
  deleteAccount,
  putAccount,
  updateAccount,
} from "../repository/accountsRepository.js";

// GET
export const fetchAccounts = async (query: AccountQuery) => {
  const { page, limit } = query;
  const startIndex = (page - 1) * limit;

  const [paginatedAccounts, total] = await Promise.all([
    getAccounts(startIndex, limit),
    getAccountsCount(),
  ]);

  const response: AccountQueryResponseType = {
    data: paginatedAccounts,
    page: page,
    limit: limit,
    total: total,
    pages: Math.ceil(total / limit),
  };

  return response;
};

export const fetchAccount = async (accountId: number) => {
  const account = await getAccount(accountId);

  if (!account) {
    throw new NotFoundError("Account does not exist");
  }

  return account;
};

// POST
export const createAccount = async (
  input: CreateAccountInput,
): Promise<Account> => {
  const existingAccount = await findAccount(input);

  if (existingAccount) {
    throw new ConflictError("Account already exists");
  }

  return postAccount(input);
};

// DELETE
export const removeAccount = async (id: number): Promise<Account> => {
  const deletedAccount = await deleteAccount(id);

  if (!deletedAccount) {
    throw new NotFoundError("Account does not exist");
  }

  return deletedAccount;
};

// PUT
export const replaceAccount = async (
  input: CreateAccountInput,
  id: number,
): Promise<Account> => {
  const updatedAccount = await putAccount(id, input);

  if (!updatedAccount) {
    throw new NotFoundError("Account does not exist");
  }

  return updatedAccount;
};

// PATCH
export const patchAccount = async (
  input: UpdateAccountInput,
  id: number,
): Promise<Account> => {
  const updatedAccount = await updateAccount(id, input);

  if (!updatedAccount) {
    throw new NotFoundError("Account does not exist");
  }

  return updatedAccount;
};
