import type { Account, CreateAccountInput } from "../types/accountTypes/accountsSchemaType.js";
import { AccountSchema } from "../types/accountTypes/accountsSchemaType.js";
import { accountsTable } from "@ledger/database/schema";

// Convert db entry to Account
export const toAccount = ((account: typeof accountsTable.$inferSelect): Account => {
    return AccountSchema.parse({
        id: account.id,
        name: account.name,
        type: account.type,
        balance: Number(account.balance),
    });
});

// Convert account input to table entry
export const toAccountEntry = (account: CreateAccountInput): typeof accountsTable.$inferInsert => {
    const accountEntry: typeof accountsTable.$inferInsert = {
        name: account.name,
        type: account.type,
        balance: String(account.balance)
    };

    return accountEntry;
};