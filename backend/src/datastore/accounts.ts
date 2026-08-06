import type { Account } from "../types/account.js";
import { AccountType } from "../types/accountType.js";

export let accounts: Account[] = [
  {
    id: 1,
    name: "Chase",
    type: AccountType.Checking,
    balance: 2450.75,
  },
  {
    id: 2,
    name: "Bank of America",
    type: AccountType.Savings,
    balance: 8200,
  },
  {
    id: 3,
    name: "American Express",
    type: AccountType.CreditCard,
    balance: -385.42,
  },
  {
    id: 4,
    name: "Wallet",
    type: AccountType.Cash,
    balance: 120,
  },
  {
    id: 5,
    name: "Morgan Stanley",
    type: AccountType.Investment,
    balance: 15750.3,
  },
];

export const setAccounts = (newAccounts: Account[]) => {
    accounts = newAccounts;
}

export const getAccounts = () => {
    return accounts;
}