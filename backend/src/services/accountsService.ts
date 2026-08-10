import { getAccounts, setAccounts } from "../datastore/accountsData.js";
import type {
  Account,
  CreateAccountInput,
  UpdateAccountInput,
} from "../types/accountsSchemaType.js";
import { generateId } from "../utils/generateId.js";
import { NotFoundError } from "../errors/AppError.js";

// GET
export const fetchAccounts = () => {
  return getAccounts();
};

export const fetchAccount = (accountId: string) => {
  const account = getAccounts().find(
    (account) => account.id === Number(accountId),
  );

  if (!account) {
    throw new NotFoundError("Account does not exist");
  }

  return account;
};

// POST
export const createAccount = (input: CreateAccountInput): Account => {
  const accounts = getAccounts();
  const maxId =
    accounts.length === 0
      ? 0
      : Math.max(...accounts.map((account) => account.id));

  const account: Account = {
    id: generateId(maxId),
    ...input,
  };

  setAccounts([...accounts, account]);
  return account;
};

// DELETE
export const removeAccount = (id: number) => {
  const accounts = getAccounts();
  const filteredAccounts = accounts.filter((account) => account.id !== id);

  if (accounts.length === filteredAccounts.length) {
    throw new NotFoundError("Account does not exist");
  }

  setAccounts(filteredAccounts);
};

// PUT
export const replaceAccount = (
  input: CreateAccountInput,
  id: number,
): Account => {
  const accounts = getAccounts();
  const accountIndex = accounts.findIndex((account) => account.id === id);

  if (accountIndex === -1) {
    throw new NotFoundError("Account does not exist");
  }

  const replacement: Account = {
    id,
    ...input,
  };

  const updatedAccounts = [...accounts];
  updatedAccounts[accountIndex] = replacement;

  setAccounts(updatedAccounts);

  return replacement;
};

// PATCH
export const patchAccount = (
  input: UpdateAccountInput,
  id: number,
): Account => {
  const accounts = getAccounts();
  const existingAccount = accounts.find((account) => account.id === id);

  if (!existingAccount) {
    throw new NotFoundError("Account does not exist");
  }

  const updatedAccount: Account = {
    id,
    name: input.name ?? existingAccount.name,
    type: input.type ?? existingAccount.type,
    balance: input.balance ?? existingAccount.balance,
  };

  const updatedAccounts = accounts.map((account) =>
    account.id === id ? updatedAccount : account,
  );

  setAccounts(updatedAccounts);

  return updatedAccount;
};
