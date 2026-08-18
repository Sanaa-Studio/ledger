import { describe, it, beforeEach } from "node:test";
import { NotFoundError } from "../../errors/AppError.js";
import assert from "node:assert";
import { setAccounts, getAccounts } from "../../datastore/accountsData.js";
import * as accountService from "../../services/accountsService.js";
import type {
  CreateAccountInput,
  UpdateAccountInput,
} from "../../types/accountTypes/accountsSchemaType.js";
import { AccountType } from "../../types/accountTypes/accountType.js";
import getMaxId from "../utils/getMaxId.js";
import type { AccountQuery } from "../../types/accountTypes/accountQuerySchema.js";

describe("Testing account service logic", () => {
  const originalAccounts = structuredClone(getAccounts());

  beforeEach(() => {
    setAccounts(structuredClone(originalAccounts));
  });

  // Happy tests for fetching accounts
  describe("Happy tests for fetching accounts", () => {
    it("Returns the first page of accounts", () => {
      const accounts = getAccounts();

      const query: AccountQuery = { 
        page: 1, 
        limit: 2 
      };

      const result = accountService.fetchAccounts(query);
      
      assert.strictEqual(result.page, 1);
      assert.strictEqual(result.limit, 2);
      assert.strictEqual(result.totalAccounts, accounts.length);
      assert.strictEqual(result.pages, Math.ceil(accounts.length / 2));

      assert.deepStrictEqual(result.data, accounts.slice(0, 2));
    });

    it("Returns the second page of accounts", () => {
        const accounts = getAccounts();

        const query: AccountQuery = {
        page: 2,
        limit: 2,
        };

        const result = accountService.fetchAccounts(query);

        assert.strictEqual(result.page, 2);
        assert.strictEqual(result.limit, 2);
        assert.deepStrictEqual(result.data, accounts.slice(2, 4));
    });

      it("Returns a partial final page", () => {
        setAccounts([
        {
            id: 1,
            name: "Account 1",
            type: AccountType.Checking,
            balance: 100,
        },
        {
            id: 2,
            name: "Account 2",
            type: AccountType.Savings,
            balance: 200,
        },
        {
            id: 3,
            name: "Account 3",
            type: AccountType.Cash,
            balance: 300,
        },
        {
            id: 4,
            name: "Account 4",
            type: AccountType.Checking,
            balance: 400,
        },
        {
            id: 5,
            name: "Account 5",
            type: AccountType.Savings,
            balance: 500,
        },
        ]);

        const result = accountService.fetchAccounts({
        page: 3,
        limit: 2,
        });

        assert.strictEqual(result.page, 3);
        assert.strictEqual(result.pages, 3);
        assert.strictEqual(result.totalAccounts, 5);

        assert.deepStrictEqual(result.data, [
        {
            id: 5,
            name: "Account 5",
            type: AccountType.Savings,
            balance: 500,
        },
        ]);
    });

    it("Returns an empty array when page is beyond available accounts", () => {
        const accounts = getAccounts();

        const result = accountService.fetchAccounts({
        page: 100,
        limit: 10,
        });

        assert.strictEqual(result.page, 100);
        assert.strictEqual(result.totalAccounts, accounts.length);
        assert.deepStrictEqual(result.data, []);
    });

    it("Calculates the correct number of pages", () => {
        setAccounts([
        {
            id: 1,
            name: "Account 1",
            type: AccountType.Checking,
            balance: 100,
        },
        {
            id: 2,
            name: "Account 2",
            type: AccountType.Checking,
            balance: 200,
        },
        {
            id: 3,
            name: "Account 3",
            type: AccountType.Checking,
            balance: 300,
        },
        {
            id: 4,
            name: "Account 4",
            type: AccountType.Checking,
            balance: 400,
        },
        {
            id: 5,
            name: "Account 5",
            type: AccountType.Checking,
            balance: 500,
        },
        ]);

        const result = accountService.fetchAccounts({
        page: 1,
        limit: 2,
        });

        assert.strictEqual(result.pages, 3);
    });

    it("Fetching existing account", () => {
        const accounts = getAccounts();

        const result = accountService.fetchAccount("1");

        assert.ok(result);
        assert.deepStrictEqual(result, accounts[0]);
    });
  });

  // Error handling tests
  describe("Testing error handling for fetching accounts", () => {
    it("Raises error on fetching non-existing account", () => {
      const accounts = getAccounts();
      const currentMaxIdx = getMaxId(accounts);

      assert.throws(() => {
        accountService.fetchAccount(String(currentMaxIdx + 1));
      }, NotFoundError);
    });
  });

  // Happy tests for Creating account
  describe("Happy tests for creating accounts", () => {
    it("Creates account successfully", () => {
      const accountsBefore = getAccounts();
      const previousMaxId = getMaxId(accountsBefore);

      const accountInput: CreateAccountInput = {
        name: "Test Bank Account",
        type: AccountType.Savings,
        balance: 1000,
      };

      const result = accountService.createAccount(accountInput);
      const accountsAfter = getAccounts();

      assert.strictEqual(result.balance, accountInput.balance);
      assert.strictEqual(result.id, previousMaxId + 1);
      assert.strictEqual(result.name, accountInput.name);
      assert.strictEqual(result.type, accountInput.type);
      assert.ok(accountsAfter.some((account) => account.id === result.id));
    });
  });

  // Happy test for Deleting accounts
  describe("Happy tests for deleting accounts", () => {
    it("Testing successful deleting of accounts", () => {
      const accounts = getAccounts();
      const currentMaxIdx = getMaxId(accounts);
      accountService.removeAccount(currentMaxIdx);
      const deletedAccount = getAccounts().find(
        (account) => account.id === currentMaxIdx,
      );
      assert.strictEqual(deletedAccount, undefined);
    });
  });

  // Error tests for Deleting accounts
  describe("Error tests for deleting accounts", () => {
    it("Testing Error handling for deleting of accounts", () => {
      const accounts = getAccounts();
      const currentMaxIdx = getMaxId(accounts);

      assert.throws(() => {
        accountService.removeAccount(currentMaxIdx + 1);
      }, NotFoundError);
    });
  });

  // Happy testing for Replacing accounts
  describe("Happy tests for replacing accounts", () => {
    it("Testing accounts are replaced sucessfully", () => {
      const accounts = getAccounts();
      const currentMaxId = getMaxId(accounts);
      const currentAccount = accounts.find(
        (account) => account.id === currentMaxId,
      );

      assert.ok(currentAccount);

      const acccountInput: CreateAccountInput = {
        name: "Replacement Account",
        type: AccountType.Cash,
        balance: 500,
      };

      const replacement = accountService.replaceAccount(
        acccountInput,
        currentAccount.id,
      );

      const storedAccount = getAccounts().find(
        (account) => account.id === currentAccount.id,
      );

      assert.deepStrictEqual(storedAccount, replacement);
      assert.strictEqual(replacement.id, currentAccount.id);
      assert.strictEqual(replacement.name, acccountInput.name);
      assert.strictEqual(replacement.balance, acccountInput.balance);
      assert.strictEqual(replacement.type, acccountInput.type);
    });
  });

  describe("Error tests for replacing accounts", () => {
    it("Testing Error handling for replacing account", () => {
      const accounts = getAccounts();
      const currentMaxId = getMaxId(accounts);
      const acccountInput: CreateAccountInput = {
        name: "Failing replacement account",
        type: AccountType.Cash,
        balance: 500,
      };

      assert.throws(() => {
        accountService.replaceAccount(acccountInput, currentMaxId + 1);
      }, NotFoundError);
    });
  });

  describe("Happy tests for patching accounts", () => {
    it("Updates one account field and preserves the others", () => {
      const accounts = getAccounts();
      const account = accounts[0];

      assert.ok(account);

      const updateInput: UpdateAccountInput = {
        balance: 2000,
      };

      const updatedAccount = accountService.patchAccount(
        updateInput,
        account.id,
      );

      assert.strictEqual(updatedAccount.id, account.id);
      assert.strictEqual(updatedAccount.balance, 2000);

      // unchanged fields
      assert.strictEqual(updatedAccount.name, account.name);
      assert.strictEqual(updatedAccount.type, account.type);
    });

    it("Updates multiple account fields", () => {
      const accounts = getAccounts();
      const account = accounts[0];

      assert.ok(account);

      const updateInput: UpdateAccountInput = {
        name: "Updated Account",
        type: AccountType.Cash,
        balance: 750,
      };

      const updatedAccount = accountService.patchAccount(
        updateInput,
        account.id,
      );

      assert.strictEqual(updatedAccount.id, account.id);
      assert.strictEqual(updatedAccount.name, "Updated Account");
      assert.strictEqual(updatedAccount.type, AccountType.Cash);
      assert.strictEqual(updatedAccount.balance, 750);
    });

    it("Updates the account in the datastore", () => {
      const accounts = getAccounts();
      const account = accounts[0];

      assert.ok(account);

      accountService.patchAccount(
        {
          balance: 5000,
        },
        account.id,
      );

      const storedAccount = getAccounts().find(
        (storedAccount) => storedAccount.id === account.id,
      );

      assert.ok(storedAccount);
      assert.strictEqual(storedAccount.balance, 5000);
    });
  });

  describe("Error tests for patching accounts", () => {
    it("Throws when attempting to patch a nonexistent account", () => {
      const accounts = getAccounts();
      const currentMaxId = getMaxId(accounts);

      assert.throws(() => {
        accountService.patchAccount(
          {
            balance: 1000,
          },
          currentMaxId + 1,
        );
      }, NotFoundError);
    });
  });
});
