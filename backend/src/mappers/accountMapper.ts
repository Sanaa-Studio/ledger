import type { Account } from "../types/accountTypes/accountsSchemaType.js";
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