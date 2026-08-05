import { Account, AccountType } from "../types/account.js";

export const accounts: Account[] = [
  {
    id: 1,
    type: AccountType.Checking,
    balance: 2450.75,
  },
  {
    id: 2,
    type: AccountType.Savings,
    balance: 8200,
  },
  {
    id: 3,
    type: AccountType.CreditCard,
    balance: -385.42,
  },
  {
    id: 4,
    type: AccountType.Cash,
    balance: 120,
  },
  {
    id: 5,
    type: AccountType.Investment,
    balance: 15750.3,
  },
];