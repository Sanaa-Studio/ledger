import type { Account, CreateAccountInput } from "@ledger/contracts";
import { AccountSchema } from "@ledger/contracts";
import { accountsTable } from "@ledger/database/schema";

// Convert db entry to Account
export const toAccount = (
  account: typeof accountsTable.$inferSelect,
): Account => {
  return AccountSchema.parse({
    ...account,
    openingBalance: Number(account.openingBalance),
  });
};

// Convert account input to table entry
export const toAccountEntry = (
  account: CreateAccountInput,
): typeof accountsTable.$inferInsert => {
  const accountEntry: typeof accountsTable.$inferInsert = {
    name: account.name,
    type: account.type,
    openingBalance: String(account.openingBalance),
  };

  return accountEntry;
};
