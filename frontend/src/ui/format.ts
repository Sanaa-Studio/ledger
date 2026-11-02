import type { Account, Transaction } from "@ledger/contracts";

export const currency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);

export const dateLabel = (value: Date | string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));

export const dateInputValue = (value: Date | string) => {
  const date = new Date(value);
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
};

export const todayInputValue = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

export const accountBalances = (
  accounts: Account[],
  transactions: Transaction[],
) => {
  const balances = new Map(
    accounts.map((account) => [account.id, account.openingBalance]),
  );

  for (const transaction of transactions) {
    const sourceBalance = balances.get(transaction.accountId);
    if (sourceBalance !== undefined) {
      balances.set(transaction.accountId, sourceBalance + transaction.amount);
    }

    if (transaction.destinationAccountId !== null) {
      const destinationBalance = balances.get(transaction.destinationAccountId);
      if (destinationBalance !== undefined) {
        balances.set(
          transaction.destinationAccountId,
          destinationBalance - transaction.amount,
        );
      }
    }
  }

  return balances;
};

export const transactionMode = (transaction: Transaction) =>
  transaction.destinationAccountId !== null
    ? "transfer"
    : transaction.amount >= 0
      ? "income"
      : "expense";
