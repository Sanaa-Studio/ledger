import { beforeEach, describe, it } from "node:test";
import assert from "node:assert";
import {
  getTransactions,
  setTransactions,
} from "../../datastore/transactionsData.js";
import * as transactionService from "../../services/transactionsService.js";
import type { CreateTransactionInput } from "../../types/transactionTypes/transactionsSchemaType.js";
import { NotFoundError, BadRequestError } from "../../errors/AppError.js";
import { getAccounts } from "../../datastore/accountsData.js";
import getMaxId from "../utils/getMaxId.js";

describe("Test Suite for the Transaction Service", () => {
  const originalTransactions = structuredClone(getTransactions());

  beforeEach(() => {
    setTransactions(structuredClone(originalTransactions));
  });

  //Happy tests for fetching transactions
  describe("Happy tests for fetching transactions", () => {
     it("Returns the first page of transactions", () => {
    const transactions = getTransactions();

    const result = transactionService.fetchTransactions({
      page: 1,
      limit: 2,
    });

    assert.strictEqual(result.page, 1);
    assert.strictEqual(result.limit, 2);
    assert.strictEqual(result.totalTransactions, transactions.length);
    assert.strictEqual(
      result.pages,
      Math.ceil(transactions.length / 2),
    );

    assert.deepStrictEqual(
      result.data,
      transactions.slice(0, 2),
    );
  });

  it("Returns the second page of transactions", () => {
    const transactions = getTransactions();

    const result = transactionService.fetchTransactions({
      page: 2,
      limit: 2,
    });

    assert.strictEqual(result.page, 2);
    assert.strictEqual(result.limit, 2);

    assert.deepStrictEqual(
      result.data,
      transactions.slice(2, 4),
    );
  });

    it("Returns a partial final page", () => {
    const transactions = getTransactions();

    assert.ok(transactions.length >= 5);

    setTransactions(transactions.slice(0, 5));

    const result = transactionService.fetchTransactions({
        page: 3,
        limit: 2,
    });

    assert.strictEqual(result.page, 3);
    assert.strictEqual(result.limit, 2);
    assert.strictEqual(result.pages, 3);
    assert.strictEqual(result.totalTransactions, 5);
    assert.strictEqual(result.data.length, 1);

    assert.deepStrictEqual(
        result.data,
        transactions.slice(4, 5),
    );
    });

  it("Returns an empty array when page exceeds available transactions", () => {
    const transactions = getTransactions();

    const result = transactionService.fetchTransactions({
      page: 100,
      limit: 10,
    });

    assert.strictEqual(result.page, 100);
    assert.strictEqual(result.totalTransactions, transactions.length);
    assert.deepStrictEqual(result.data, []);
  });

  it("Calculates the correct number of pages", () => {
    const transactions = getTransactions();

    const result = transactionService.fetchTransactions({
      page: 1,
      limit: 2,
    });

    assert.strictEqual(
      result.pages,
      Math.ceil(transactions.length / 2),
    );
  });

  it("Fetching existing transaction", () => {
    const transactions = getTransactions();
    const currentMaxId = getMaxId(transactions);

    const initialTransaction = transactions.find(
      (transaction) => transaction.id === currentMaxId,
    );

    const fetchedTransaction =
      transactionService.fetchTransaction(currentMaxId);

    assert.ok(fetchedTransaction);
    assert.deepStrictEqual(initialTransaction, fetchedTransaction);
  });
  });

  // Error test for fetching transaction
  describe("Error tests for fetching transaction", () => {
    it("Raises error on fetching non-existing transaction", () => {
      const transactions = getTransactions();
      const currentMaxId = getMaxId(transactions);

      assert.throws(() => {
        transactionService.fetchTransaction(currentMaxId + 1);
      }, NotFoundError);
    });
  });

  // Happy test for creating transaction
  describe("Happy test for creating transaction", () => {
    it("Succesfully creates a transaction", () => {
      const initialTransactions = getTransactions();
      const previousMaxId = getMaxId(initialTransactions);

      const accounts = getAccounts();
      const sourceAccount = accounts[0];

      assert.ok(sourceAccount);

      const transactionInput: CreateTransactionInput = {
        accountId: sourceAccount.id,
        amount: 100,
        description: "Test transaction",
        date: new Date(),
      };

      const createdTransaction =
        transactionService.makeTransaction(transactionInput);

      const transactionsAfter = getTransactions();

      assert.strictEqual(createdTransaction.id, previousMaxId + 1);
      assert.strictEqual(
        createdTransaction.accountId,
        transactionInput.accountId,
      );
      assert.strictEqual(createdTransaction.amount, transactionInput.amount);
      assert.strictEqual(
        createdTransaction.description,
        transactionInput.description,
      );

      assert.ok(
        transactionsAfter.some(
          (transaction) => transaction.id === createdTransaction.id,
        ),
      );
    });

    it("Successfully creates a transaction with a destination account", () => {
      const accounts = getAccounts();
      const sourceAccount = accounts[0];
      const destinationAccount = accounts[1];

      assert.ok(sourceAccount);
      assert.ok(destinationAccount);

      const transactionInput: CreateTransactionInput = {
        accountId: sourceAccount.id,
        destinationAccountId: destinationAccount.id,
        amount: 250,
        description: "Transfer",
        date: new Date(),
      };

      const createdTransaction =
        transactionService.makeTransaction(transactionInput);

      assert.strictEqual(createdTransaction.accountId, sourceAccount.id);

      assert.strictEqual(
        createdTransaction.destinationAccountId,
        destinationAccount.id,
      );

      assert.strictEqual(createdTransaction.amount, 250);

      const storedTransaction = getTransactions().find(
        (transaction) => transaction.id === createdTransaction.id,
      );

      assert.deepStrictEqual(storedTransaction, createdTransaction);
    });
  });
  describe("Error tests for creating transactions", () => {
    it("Throws when origin account does not exist", () => {
      const accounts = getAccounts();
      const maxAccountId = Math.max(...accounts.map((account) => account.id));

      const transactionInput: CreateTransactionInput = {
        accountId: maxAccountId + 1,
        amount: 100,
        description: "Invalid transaction",
        date: new Date(),
      };

      assert.throws(() => {
        transactionService.makeTransaction(transactionInput);
      }, NotFoundError);
    });
    it("Throws when destination account does not exist", () => {
      const accounts = getAccounts();
      const sourceAccount = accounts[0];

      assert.ok(sourceAccount);

      const maxAccountId = Math.max(...accounts.map((account) => account.id));

      const transactionInput: CreateTransactionInput = {
        accountId: sourceAccount.id,
        destinationAccountId: maxAccountId + 1,
        amount: 100,
        description: "Invalid transfer",
        date: new Date(),
      };

      assert.throws(() => {
        transactionService.makeTransaction(transactionInput);
      }, NotFoundError);
    });
    it("Throws when origin and destination are the same account", () => {
      const accounts = getAccounts();
      const account = accounts[0];

      assert.ok(account);

      const transactionInput: CreateTransactionInput = {
        accountId: account.id,
        destinationAccountId: account.id,
        amount: 100,
        description: "Invalid transfer",
        date: new Date(),
      };

      assert.throws(() => {
        transactionService.makeTransaction(transactionInput);
      }, BadRequestError);
    });

    it("Does not create a transaction when origin account does not exist", () => {
      const transactionsBefore = getTransactions();
      const accounts = getAccounts();

      const maxAccountId = Math.max(...accounts.map((account) => account.id));

      const transactionInput: CreateTransactionInput = {
        accountId: maxAccountId + 1,
        amount: 100,
        description: "Invalid transaction",
        date: new Date(),
      };

      assert.throws(() => {
        transactionService.makeTransaction(transactionInput);
      }, NotFoundError);

      const transactionsAfter = getTransactions();

      assert.deepStrictEqual(transactionsAfter, transactionsBefore);
    });
  });

  describe("Happy tests for deleting transactions", () => {
    it("Successfully deletes an existing transaction", () => {
      const transactions = getTransactions();
      const currentMaxId = getMaxId(transactions);

      const result = transactionService.removeTransaction(currentMaxId);

      const deletedTransaction = getTransactions().find(
        (transaction) => transaction.id === currentMaxId,
      );

      assert.strictEqual(result, true);
      assert.strictEqual(deletedTransaction, undefined);
    });
  });

  describe("Error tests for deleting transactions", () => {
    it("Throws when deleting a nonexistent transaction", () => {
      const transactions = getTransactions();
      const currentMaxId = getMaxId(transactions);

      assert.throws(() => {
        transactionService.removeTransaction(currentMaxId + 1);
      }, NotFoundError);
    });
  });
});
