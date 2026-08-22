import * as z from "zod";

export const AccountType = {
  Checking: "checking",
  Savings: "savings",
  CreditCard: "creditCard",
  Cash: "cash",
  Investment: "investment",
} as const;

export const AccountTypeSchema = z.enum(AccountType);
