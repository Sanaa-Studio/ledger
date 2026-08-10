import { beforeEach, describe, it } from "node:test";
import assert from "node:assert";
import {
  getTransactions,
  setTransactions,
} from "../../datastore/transactionsData.js";
import * as transactionService from "../../services/transactionsService.js";
import { CreateTransactionInput } from "../../types/transactionsSchemaType.js";
import { NotFoundError, BadRequestError } from "../../errors/AppError.js";
import { getAccounts } from "../../datastore/accountsData.js";
import getMaxId from "../utils/getMaxId.js";

describe("Test Suite for the Transaction Service", () => {
  const transactions = structuredClone(getTransactions());

  beforeEach(() => {
    setTransactions(structuredClone(transactions));
  });

  //Happy tests for fetching transactions
  describe("Happy tests for fetching transactions", () => {
    it("Fetching transactions", () => {
      const currentTransactions = getTransactions();
      const fetchedTransactions = transactionService.fetchTransactions();

      assert.ok(fetchedTransactions);
      assert.deepStrictEqual(currentTransactions, fetchedTransactions);
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
