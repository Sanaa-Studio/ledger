import { accountsTable, transactionsTable } from "@ledger/database/schema";
import { db } from "../../db/db.js";
import { sql } from "drizzle-orm";

export const resetTestDb = async () => {
  await db.execute(sql`
        TRUNCATE TABLE
        ${transactionsTable},
        ${accountsTable}
        RESTART IDENTITY
    `);

  await db.insert(accountsTable).values([
    {
      name: "Test Checking",
      type: "checking",
      openingBalance: "1000.00",
    },
    {
      name: "Test Savings",
      type: "savings",
      openingBalance: "500.00",
    },
  ]);

  await db.insert(transactionsTable).values([
    {
      accountId: 1,
      amount: "-50.00",
      description: "Groceries",
      date: new Date("2026-08-01"),
    },
  ]);
};
