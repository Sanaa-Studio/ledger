import { accounts } from "../datastore/accounts.js";
import type { Account, CreateAccountInput } from "../types/account.js";
import { generateId } from "./generateId.js";

export const fetchAccounts = () => {
    return accounts;
};

export const fetchAccount = (accountId: string) => {
    const account = accounts.find((account) => account.id === Number(accountId));
    return account;
}

export const createAccount = (input: CreateAccountInput): Account => {
   const maxId = accounts.length === 0 
    ? 0
    : Math.max(...accounts.map((account) => account.id));

    const account: Account = {
        id: generateId(maxId),
        ...input
    }

    accounts.push(account);
    return account
} 