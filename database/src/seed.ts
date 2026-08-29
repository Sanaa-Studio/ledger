import { db, pool } from "./index.js";
import { sql } from "drizzle-orm";
import { accountsTable, transactionsTable } from "./schema.js";

import accountsSeed from "./utils/accountsSeed.json" with { type: "json" };
import transactionsSeed from "./utils/transactionsSeed.json" with { type: "json" };

const main = async () => {
  await db.transaction(async (tx) => {
    await tx.execute(
      sql`TRUNCATE TABLE ${transactionsTable}, ${accountsTable} RESTART IDENTITY`,
    );

    for (const account of accountsSeed) {
      const accountEntry: typeof accountsTable.$inferInsert = {
        name: account.name,
        type: account.type,
        openingBalance: String(account.balance),
      };

      await tx.insert(accountsTable).values(accountEntry);
    }

    for (const transaction of transactionsSeed) {
      const transactionEntry: typeof transactionsTable.$inferInsert = {
        accountId: transaction.accountId,
        destinationAccountId: transaction.destinationAccountId,
        amount: String(transaction.amount),
        description: transaction.description,
        date: new Date(transaction.date),
      };

      await tx.insert(transactionsTable).values(transactionEntry);
    }
  });

  console.log("Database seeded successfully.");
};

main()
  .catch((error) => {
    console.error("Failed to seed database:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
