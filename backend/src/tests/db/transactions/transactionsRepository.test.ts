import {
  afterAll,
  beforeEach,
  describe,
  expect,
  test,
} from "@jest/globals";

import {
  getTransactions,
  getTransaction,
  getTransactionsCount,
  postTransaction,
  putTransaction,
  updateTransaction,
  deleteTransaction,
} from "../../../repository/transactionsRepository.js";

import { resetTestDb } from "../../helpers/resetTestDb.js";
import { pool } from "../../../db/db.js";

import type {
  CreateTransactionInput,
  UpdateTransactionInput,
} from "../../../types/transactionTypes/transactionsSchemaType.js";


beforeEach(async () => {
  await resetTestDb();
});

afterAll(async () => {
  await pool.end();
});


// ======================================================
// GET ALL
// ======================================================

describe("getTransactions", () => {
  test("returns transactions from the database", async () => {
    const transactions = await getTransactions(0, 10);

    expect(transactions).toEqual([
      {
        id: 1,
        accountId: 1,
        destinationAccountId: null,
        amount: -50,
        description: "Groceries",
        date: new Date("2026-08-01"),
      },
    ]);
  });


  test("returns transactions newest first", async () => {
    await postTransaction({
      accountId: 1,
      amount: -25,
      description: "Dinner",
      date: new Date("2026-08-10"),
    });

    await postTransaction({
      accountId: 1,
      amount: 1000,
      description: "Paycheck",
      date: new Date("2026-08-05"),
    });

    const transactions = await getTransactions(
      0,
      10,
    );

    expect(
      transactions.map(
        (transaction) => transaction.description,
      ),
    ).toEqual([
      "Dinner",
      "Paycheck",
      "Groceries",
    ]);
  });


  test("applies offset and limit", async () => {
    await postTransaction({
      accountId: 1,
      amount: -25,
      description: "Dinner",
      date: new Date("2026-08-10"),
    });

    await postTransaction({
      accountId: 1,
      amount: 1000,
      description: "Paycheck",
      date: new Date("2026-08-05"),
    });

    const transactions = await getTransactions(
      1,
      1,
    );

    expect(transactions).toHaveLength(1);

    expect(transactions[0]?.description)
      .toBe("Paycheck");
  });


  test("returns empty array when offset exceeds available rows", async () => {
    const transactions = await getTransactions(
      100,
      10,
    );

    expect(transactions).toEqual([]);
  });
});


// ======================================================
// GET ONE
// ======================================================

describe("getTransaction", () => {
  test("returns an existing transaction", async () => {
    const transaction = await getTransaction(1);

    expect(transaction).toEqual({
      id: 1,
      accountId: 1,
      destinationAccountId: null,
      amount: -50,
      description: "Groceries",
      date: new Date("2026-08-01"),
    });
  });


  test("returns undefined when transaction does not exist", async () => {
    const transaction = await getTransaction(999);

    expect(transaction).toBeUndefined();
  });
});


// ======================================================
// COUNT
// ======================================================

describe("getTransactionsCount", () => {
  test("returns number of transactions", async () => {
    const count = await getTransactionsCount();

    expect(count).toBe(1);
  });


  test("count changes after inserting transaction", async () => {
    await postTransaction({
      accountId: 1,
      amount: -20,
      description: "Coffee",
      date: new Date("2026-08-02"),
    });

    const count = await getTransactionsCount();

    expect(count).toBe(2);
  });
});


// ======================================================
// POST
// ======================================================

describe("postTransaction", () => {
  test("inserts and returns a transaction", async () => {
    const input: CreateTransactionInput = {
      accountId: 1,
      amount: -100,
      description: "Restaurant",
      date: new Date("2026-08-20"),
    };

    const createdTransaction =
      await postTransaction(input);

    expect(createdTransaction).toEqual({
      id: 2,
      accountId: 1,
      destinationAccountId: null,
      amount: -100,
      description: "Restaurant",
      date: new Date("2026-08-20"),
    });

    const storedTransaction =
      await getTransaction(2);

    expect(storedTransaction)
      .toEqual(createdTransaction);
  });


  test("inserts a transfer transaction", async () => {
    const input: CreateTransactionInput = {
      accountId: 1,
      destinationAccountId: 2,
      amount: -250,
      description: "Transfer to savings",
      date: new Date("2026-08-20"),
    };

    const transaction =
      await postTransaction(input);

    expect(transaction).toEqual({
      id: 2,
      accountId: 1,
      destinationAccountId: 2,
      amount: -250,
      description: "Transfer to savings",
      date: new Date("2026-08-20"),
    });
  });


  test("converts numeric database amount back to number", async () => {
    const transaction =
      await postTransaction({
        accountId: 1,
        amount: -12.75,
        date: new Date("2026-08-20"),
      });

    expect(typeof transaction.amount)
      .toBe("number");

    expect(transaction.amount)
      .toBe(-12.75);
  });


  test("returns null for nullable fields when omitted", async () => {
    const transaction =
      await postTransaction({
        accountId: 1,
        amount: -10,
        date: new Date("2026-08-20"),
      });

    expect(transaction.destinationAccountId)
      .toBeNull();

    expect(transaction.description)
      .toBeNull();
  });


  test("database rejects nonexistent source account", async () => {
    await expect(
      postTransaction({
        accountId: 999,
        amount: -50,
        date: new Date("2026-08-20"),
      }),
    ).rejects.toThrow();
  });


  test("database rejects nonexistent destination account", async () => {
    await expect(
      postTransaction({
        accountId: 1,
        destinationAccountId: 999,
        amount: -50,
        date: new Date("2026-08-20"),
      }),
    ).rejects.toThrow();
  });
});


// ======================================================
// PUT
// ======================================================

describe("putTransaction", () => {
  test("fully replaces an existing transaction", async () => {
    const input: CreateTransactionInput = {
      accountId: 2,
      amount: 500,
      description: "Updated transaction",
      date: new Date("2026-08-15"),
    };

    const updatedTransaction =
      await putTransaction(1, input);

    expect(updatedTransaction).toEqual({
      id: 1,
      accountId: 2,
      destinationAccountId: null,
      amount: 500,
      description: "Updated transaction",
      date: new Date("2026-08-15"),
    });

    const storedTransaction =
      await getTransaction(1);

    expect(storedTransaction)
      .toEqual(updatedTransaction);
  });


  test("replaces transaction with a transfer", async () => {
    const input: CreateTransactionInput = {
      accountId: 1,
      destinationAccountId: 2,
      amount: -400,
      description: "Transfer",
      date: new Date("2026-08-18"),
    };

    const transaction =
      await putTransaction(1, input);

    expect(transaction?.destinationAccountId)
      .toBe(2);

    expect(transaction?.amount)
      .toBe(-400);
  });


  test("clears optional fields when omitted during PUT", async () => {
    await putTransaction(1, {
      accountId: 1,
      destinationAccountId: 2,
      amount: -100,
      description: "Transfer",
      date: new Date("2026-08-10"),
    });

    const updatedTransaction =
      await putTransaction(1, {
        accountId: 1,
        amount: -50,
        date: new Date("2026-08-20"),
      });

    expect(
      updatedTransaction?.destinationAccountId,
    ).toBeNull();

    expect(
      updatedTransaction?.description,
    ).toBeNull();
  });


  test("returns undefined when transaction does not exist", async () => {
    const result = await putTransaction(
      999,
      {
        accountId: 1,
        amount: -50,
        date: new Date("2026-08-20"),
      },
    );

    expect(result).toBeUndefined();
  });
});


// ======================================================
// PATCH
// ======================================================

describe("updateTransaction", () => {
  test("updates only the supplied amount", async () => {
    const input: UpdateTransactionInput = {
      amount: -125,
    };

    const transaction =
      await updateTransaction(1, input);

    expect(transaction).toEqual({
      id: 1,

      // unchanged
      accountId: 1,
      destinationAccountId: null,
      description: "Groceries",
      date: new Date("2026-08-01"),

      // changed
      amount: -125,
    });
  });


  test("updates multiple supplied fields", async () => {
    const input: UpdateTransactionInput = {
      amount: -200,
      description: "Updated groceries",
      date: new Date("2026-08-15"),
    };

    const transaction =
      await updateTransaction(1, input);

    expect(transaction).toEqual({
      id: 1,
      accountId: 1,
      destinationAccountId: null,
      amount: -200,
      description: "Updated groceries",
      date: new Date("2026-08-15"),
    });
  });


  test("can add a destination account", async () => {
    const transaction =
      await updateTransaction(1, {
        destinationAccountId: 2,
      });

    expect(transaction?.destinationAccountId)
      .toBe(2);

    const storedTransaction =
      await getTransaction(1);

    expect(storedTransaction?.destinationAccountId)
      .toBe(2);
  });


  test("can explicitly clear destination account with null", async () => {
    await updateTransaction(1, {
      destinationAccountId: 2,
    });

    const transaction =
      await updateTransaction(1, {
        destinationAccountId: null,
      });

    expect(transaction?.destinationAccountId)
      .toBeNull();
  });


  test("can explicitly clear description with null", async () => {
    const transaction =
      await updateTransaction(1, {
        description: null,
      });

    expect(transaction?.description)
      .toBeNull();
  });


  test("returns undefined when transaction does not exist", async () => {
    const result =
      await updateTransaction(999, {
        amount: -100,
      });

    expect(result).toBeUndefined();
  });
});


// ======================================================
// DELETE
// ======================================================

describe("deleteTransaction", () => {
  test("deletes and returns existing transaction", async () => {
    const deletedTransaction =
      await deleteTransaction(1);

    expect(deletedTransaction).toEqual({
      id: 1,
      accountId: 1,
      destinationAccountId: null,
      amount: -50,
      description: "Groceries",
      date: new Date("2026-08-01"),
    });

    const transactionAfterDelete =
      await getTransaction(1);

    expect(transactionAfterDelete)
      .toBeUndefined();
  });


  test("returns undefined when transaction does not exist", async () => {
    const result =
      await deleteTransaction(999);

    expect(result).toBeUndefined();
  });
});