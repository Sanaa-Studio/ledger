import { AccountType, type Account } from "@ledger/contracts";

export const ACCOUNT_TYPES = Object.values(AccountType);

export const ACCOUNT_TYPE_LABELS: Record<Account["type"], string> = {
  [AccountType.Checking]: "Checking",
  [AccountType.Savings]: "Savings",
  [AccountType.CreditCard]: "Credit card",
  [AccountType.Cash]: "Cash",
  [AccountType.Investment]: "Investment",
};

export const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "grid" },
  { label: "Accounts", href: "/accounts", icon: "wallet" },
  { label: "Transactions", href: "/transactions", icon: "activity" },
  { label: "Analytics", href: "/analytics", icon: "chart" },
  { label: "Settings", href: "/settings", icon: "settings" },
] as const;

export const PAGE_SIZE = 10;
export const API_MAX_PAGE_SIZE = 100;
