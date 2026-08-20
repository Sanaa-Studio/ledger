import { db } from "../db/db.js";
import {accountsTable } from "@ledger/database/schema";
import { eq, asc, count } from "drizzle-orm";
import { toAccount } from "../mappers/accountMapper.js";

// GET
export const getAccounts = async (offset: number, limit: number) => {
    const accounts = await db
        .select()
        .from(accountsTable)
        .orderBy(asc(accountsTable.id))
        .limit(limit)
        .offset(offset)
    
    
    return accounts.map(toAccount);
};

export const getAccount = async (id: number) => {
    const [account] = await db
        .select()
        .from(accountsTable)
        .where(eq(accountsTable.id, id))
    
    return account ? toAccount(account) : undefined;
};

export const getAccountsCount = async () => {
    const accountsCount = await db
        .select({ count: count() })
        .from(accountsTable);
    
    return accountsCount[0]?.count ?? 0;
};