import { db } from "../db/db.js";
import {accountsTable } from "@ledger/database/schema";
import { eq, asc, count, and } from "drizzle-orm";
import { toAccount, toAccountEntry } from "../mappers/accountMapper.js";
import type {  Account, CreateAccountInput, UpdateAccountInput } from "../types/accountTypes/accountsSchemaType.js";

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

export const findAccount = async (input: CreateAccountInput): Promise<Account | undefined> => {
    const [account] = await db
        .select()
        .from(accountsTable)
        .where(and(
            eq(accountsTable.name, input.name), 
            eq(accountsTable.type, input.type), 
        ))
        .limit(1);
    
    return account? toAccount(account) : undefined;
};

// POST
export const postAccount = async (accountInput: CreateAccountInput): Promise<Account> => {
    const transformedAccount = toAccountEntry(accountInput);

    const [returnedAccount] = await db
        .insert(accountsTable)
        .values(transformedAccount)
        .returning();
    
    if (!returnedAccount) {
        throw new Error("Database failed to return created account");
    }

    return toAccount(returnedAccount);
};

export const deleteAccount = async (id: number) => {
    const [deletedAccount] = await db
        .delete(accountsTable)
        .where(eq(accountsTable.id, id))
        .returning();

    return deletedAccount ? toAccount(deletedAccount) : undefined;
};

export const putAccount = async (id: number, input: CreateAccountInput): Promise<Account | undefined> => {
    const [updatedAccount] = await db
        .update(accountsTable)
        .set(
            {
                name: input.name,
                type: input.type,
                openingBalance: String(input.openingBalance)
            }
        )
        .where(eq(accountsTable.id, id))
        .returning();
    
    return updatedAccount ? toAccount(updatedAccount): undefined;
};

export const updateAccount = async (id: number, input: UpdateAccountInput): Promise<Account | undefined> => {
    const [updatedAccount] = await db
        .update(accountsTable)
        .set(
            {
                name: input.name,
                type: input.type,
                openingBalance: input.openingBalance !== undefined
                    ? String(input.openingBalance)
                    : undefined,
            }
        )
        .where(eq(accountsTable.id, id))
        .returning();
    
    return updatedAccount ? toAccount(updatedAccount): undefined;
};