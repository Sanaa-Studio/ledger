import { timestamp, serial, integer, numeric, pgTable, varchar, date } from "drizzle-orm/pg-core";

export const accountsTable = pgTable("accounts", {
  id: serial().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  type: varchar({ length: 255 }).notNull(),
  balance: numeric({ precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp().notNull().defaultNow(),
});

export const transactionsTable = pgTable("transactions", {
  id: serial().primaryKey(),

  accountId: integer()
    .references(
        () => accountsTable.id,
        { onDelete: "cascade" }
    )
    .notNull(),

  destinationAccountId: integer()
    .references(
        () => accountsTable.id,
        { onDelete: "set null" }
    ),

  amount: numeric({ 
    precision: 12, scale: 2 })
    .notNull(),

  description: varchar({ length: 255 }),

  date: date()
    .notNull()
    .defaultNow(),

  createdAt: timestamp()
    .notNull()
    .defaultNow(),
});