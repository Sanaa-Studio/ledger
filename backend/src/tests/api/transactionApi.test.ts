import request from "supertest";
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert";
import app from "../../app.js";
import {
  getTransactions,
  setTransactions,
} from "../../datastore/transactionsData.js";
import { getAccounts, setAccounts } from "../../datastore/accountsData.js";
import getMaxId from "../utils/getMaxId.js";

describe("Transaction API test suite", () => {
  const originalTransactions = structuredClone(getTransactions());
  const originalAccounts = structuredClone(getAccounts());

  beforeEach(() => {
    setTransactions(structuredClone(originalTransactions));
    setAccounts(structuredClone(originalAccounts));
  });

  // GET ALL
  describe("GET /api/transactions", () => {
    it("Should return paginated transactions", async () => {
        const transactions = getTransactions();

        const expectedTransactions = transactions
        .slice(0, 2)
        .map((transaction) => ({
            ...transaction,
            date: transaction.date.toISOString(),
        }));

        const result = await request(app).get(
        "/api/transactions?page=1&limit=2",
        );

        assert.strictEqual(result.statusCode, 200);

        assert.strictEqual(result.body.page, 1);
        assert.strictEqual(result.body.limit, 2);
        assert.strictEqual(
        result.body.totalTransactions,
        transactions.length,
        );
        assert.strictEqual(
        result.body.pages,
        Math.ceil(transactions.length / 2),
        );

        assert.deepStrictEqual(
        result.body.data,
        expectedTransactions,
        );
    });

    it("Should return the second page of transactions", async () => {
    const transactions = getTransactions();

    const expectedTransactions = transactions
      .slice(2, 4)
      .map((transaction) => ({
        ...transaction,
        date: transaction.date.toISOString(),
      }));

    const result = await request(app).get(
      "/api/transactions?page=2&limit=2",
    );

    assert.strictEqual(result.statusCode, 200);
    assert.strictEqual(result.body.page, 2);
    assert.strictEqual(result.body.limit, 2);

    assert.deepStrictEqual(
      result.body.data,
      expectedTransactions,
    );
  });

    it("Should return an empty data array when page exceeds available transactions", async () => {
        const result = await request(app).get(
        "/api/transactions?page=100&limit=10",
        );

        assert.strictEqual(result.statusCode, 200);
        assert.deepStrictEqual(result.body.data, []);
    });

    it("Should return 400 when page is invalid", async () => {
        const result = await request(app).get(
        "/api/transactions?page=0&limit=10",
        );

        assert.strictEqual(result.statusCode, 400);
        assert.strictEqual(
        result.body.error,
        "Invalid transaction data",
        );
    });

    it("Should return 400 when limit is invalid", async () => {
        const result = await request(app).get(
        "/api/transactions?page=1&limit=0",
        );

        assert.strictEqual(result.statusCode, 400);
    });

    it("Should return 400 when pagination parameters are not numeric", async () => {
        const result = await request(app).get(
        "/api/transactions?page=abc&limit=xyz",
        );

        assert.strictEqual(result.statusCode, 400);
    });
  });

  // GET ONE
  describe("GET /api/transactions/:id", () => {
    it("Should return an existing transaction", async () => {
      const transactions = getTransactions();
      const currentMaxId = getMaxId(transactions);

      const transaction = transactions.find(
        (transaction) => transaction.id === currentMaxId,
      );

      assert.ok(transaction);

      const expectedTransaction = {
        ...transaction,
        date: transaction.date.toISOString(),
      };

      assert.ok(expectedTransaction);

      const result = await request(app).get(
        `/api/transactions/${currentMaxId}`,
      );

      assert.strictEqual(result.statusCode, 200);

      assert.deepStrictEqual(result.body, expectedTransaction);
    });

    it("Should return 404 for a nonexistent transaction", async () => {
      const transactions = getTransactions();
      const currentMaxId = getMaxId(transactions);

      const result = await request(app).get(
        `/api/transactions/${currentMaxId + 1}`,
      );

      assert.strictEqual(result.statusCode, 404);
    });
  });

  // POST
  describe("POST /api/transactions", () => {
    it("Should create a transaction", async () => {
      const transactionsBefore = getTransactions();
      const previousMaxId = getMaxId(transactionsBefore);

      const accounts = getAccounts();
      const sourceAccount = accounts[0];

      assert.ok(sourceAccount);

      const transactionInput = {
        accountId: sourceAccount.id,
        amount: 100,
        description: "Test transaction",
        date: new Date().toISOString(),
      };

      const result = await request(app)
        .post("/api/transactions")
        .send(transactionInput);

      assert.strictEqual(result.statusCode, 201);

      assert.strictEqual(result.body.id, previousMaxId + 1);

      assert.strictEqual(result.body.accountId, transactionInput.accountId);

      assert.strictEqual(result.body.amount, transactionInput.amount);

      assert.strictEqual(result.body.description, transactionInput.description);

      const storedTransaction = getTransactions().find(
        (transaction) => transaction.id === result.body.id,
      );

      assert.ok(storedTransaction);
    });

    it("Should create a transaction with a destination account", async () => {
      const accounts = getAccounts();

      const sourceAccount = accounts[0];
      const destinationAccount = accounts[1];

      assert.ok(sourceAccount);
      assert.ok(destinationAccount);

      const transactionInput = {
        accountId: sourceAccount.id,
        destinationAccountId: destinationAccount.id,
        amount: 250,
        description: "Transfer",
        date: new Date().toISOString(),
      };

      const result = await request(app)
        .post("/api/transactions")
        .send(transactionInput);

      assert.strictEqual(result.statusCode, 201);

      assert.strictEqual(result.body.accountId, sourceAccount.id);

      assert.strictEqual(
        result.body.destinationAccountId,
        destinationAccount.id,
      );

      assert.strictEqual(result.body.amount, 250);

      const storedTransaction = getTransactions().find(
        (transaction) => transaction.id === result.body.id,
      );

      assert.ok(storedTransaction);
    });

    it("Should return 400 for invalid transaction data", async () => {
      const accounts = getAccounts();
      const sourceAccount = accounts[0];

      assert.ok(sourceAccount);

      const invalidTransaction = {
        accountId: sourceAccount.id,
        amount: "not a number",
        description: "Invalid transaction",
        date: new Date().toISOString(),
      };

      const result = await request(app)
        .post("/api/transactions")
        .send(invalidTransaction);

      assert.strictEqual(result.statusCode, 400);
      assert.strictEqual(result.body.error, "Invalid transaction data");
    });

    it("Should return 404 when origin account does not exist", async () => {
      const accounts = getAccounts();

      const maxAccountId = Math.max(...accounts.map((account) => account.id));

      const transactionInput = {
        accountId: maxAccountId + 1,
        amount: 100,
        description: "Invalid transaction",
        date: new Date().toISOString(),
      };

      const result = await request(app)
        .post("/api/transactions")
        .send(transactionInput);

      assert.strictEqual(result.statusCode, 404);
    });

    it("Should return 404 when destination account does not exist", async () => {
      const accounts = getAccounts();
      const sourceAccount = accounts[0];

      assert.ok(sourceAccount);

      const maxAccountId = Math.max(...accounts.map((account) => account.id));

      const transactionInput = {
        accountId: sourceAccount.id,
        destinationAccountId: maxAccountId + 1,
        amount: 100,
        description: "Invalid transfer",
        date: new Date().toISOString(),
      };

      const result = await request(app)
        .post("/api/transactions")
        .send(transactionInput);

      assert.strictEqual(result.statusCode, 404);
    });

    it("Should return 400 when origin and destination are the same", async () => {
      const accounts = getAccounts();
      const account = accounts[0];

      assert.ok(account);

      const transactionInput = {
        accountId: account.id,
        destinationAccountId: account.id,
        amount: 100,
        description: "Invalid transfer",
        date: new Date().toISOString(),
      };

      const result = await request(app)
        .post("/api/transactions")
        .send(transactionInput);

      assert.strictEqual(result.statusCode, 400);
    });

    it("Should not create a transaction when request fails", async () => {
      const transactionsBefore = structuredClone(getTransactions());

      const accounts = getAccounts();

      const maxAccountId = Math.max(...accounts.map((account) => account.id));

      const result = await request(app)
        .post("/api/transactions")
        .send({
          accountId: maxAccountId + 1,
          amount: 100,
          description: "Invalid transaction",
          date: new Date().toISOString(),
        });

      assert.strictEqual(result.statusCode, 404);

      assert.deepStrictEqual(getTransactions(), transactionsBefore);
    });
  });

  // DELETE
  describe("DELETE /api/transactions/:id", () => {
    it("Should delete an existing transaction", async () => {
      const transactions = getTransactions();
      const currentMaxId = getMaxId(transactions);

      const result = await request(app).delete(
        `/api/transactions/${currentMaxId}`,
      );

      assert.strictEqual(result.statusCode, 204);

      const deletedTransaction = getTransactions().find(
        (transaction) => transaction.id === currentMaxId,
      );

      assert.strictEqual(deletedTransaction, undefined);
    });

    it("Should return 404 when deleting a nonexistent transaction", async () => {
      const transactions = getTransactions();
      const currentMaxId = getMaxId(transactions);

      const result = await request(app).delete(
        `/api/transactions/${currentMaxId + 1}`,
      );

      assert.strictEqual(result.statusCode, 404);
    });
  });
});
