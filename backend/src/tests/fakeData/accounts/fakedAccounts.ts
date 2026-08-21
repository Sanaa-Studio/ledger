import type { Account } from "../../../types/accountTypes/accountsSchemaType.js";

export const fakeAccounts: Account[] = [
  {
    id: 1,
    name: "Chase Checking",
    type: "checking",
    openingBalance: 2450.75,
  },
  {
    id: 2,
    name: "Ally Savings",
    type: "savings",
    openingBalance: 8200,
  },
  {
    id: 3,
    name: "American Express",
    type: "creditCard",
    openingBalance: -640.25,
  },
  {
    id: 4,
    name: "Wallet",
    type: "cash",
    openingBalance: 180,
  },
  {
    id: 5,
    name: "Morgan Stanley Brokerage",
    type: "investment",
    openingBalance: 12500.5,
  },
  {
    id: 6,
    name: "Capital One Checking",
    type: "checking",
    openingBalance: 975.35,
  },
];