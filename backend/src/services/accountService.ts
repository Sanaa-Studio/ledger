import { accounts } from "../datastore/accounts.js";

export const fetchAccounts = () => {
    return accounts;
};

export const fetchAccount = (accountId: string) => {
    const account = accounts.find((account) => account.id === Number(accountId));
    return account;
}