import {
  afterAll,
  beforeEach,
  describe,
  expect,
  test,
} from "@jest/globals";

import {
  getAccounts,
  getAccount,
  getAccountsCount,
  findAccount,
  postAccount,
  deleteAccount,
  putAccount,
  updateAccount,
} from "../../../repository/accountsRepository.js";

import { resetTestDb } from "../../helpers/resetTestDb.js";
import { pool } from "../../../db/db.js";

import type {
  CreateAccountInput,
  UpdateAccountInput,
} from "../../../types/accountTypes/accountsSchemaType.js";


beforeEach(async () => {
  await resetTestDb();
});

afterAll(async () => {
  await pool.end();
});


// ======================================================
// GET ALL
// ======================================================

describe("getAccounts", () => {
  test("returns accounts from the database", async () => {
    const accounts = await getAccounts(0, 10);

    expect(accounts).toEqual([
      {
        id: 1,
        name: "Test Checking",
        type: "checking",
        openingBalance: 1000,
      },
      {
        id: 2,
        name: "Test Savings",
        type: "savings",
        openingBalance: 500,
      },
    ]);
  });


  test("applies offset and limit", async () => {
    const accounts = await getAccounts(1, 1);

    expect(accounts).toEqual([
      {
        id: 2,
        name: "Test Savings",
        type: "savings",
        openingBalance: 500,
      },
    ]);
  });


  test("returns empty array when offset exceeds rows", async () => {
    const accounts = await getAccounts(100, 10);

    expect(accounts).toEqual([]);
  });
});


// ======================================================
// GET ONE
// ======================================================

describe("getAccount", () => {
  test("returns an existing account", async () => {
    const account = await getAccount(1);

    expect(account).toEqual({
      id: 1,
      name: "Test Checking",
      type: "checking",
      openingBalance: 1000,
    });
  });


  test("returns undefined for nonexistent account", async () => {
    const account = await getAccount(999);

    expect(account).toBeUndefined();
  });
});


// ======================================================
// COUNT
// ======================================================

describe("getAccountsCount", () => {
  test("returns number of accounts", async () => {
    const count = await getAccountsCount();

    expect(count).toBe(2);
  });
});


// ======================================================
// FIND
// ======================================================

describe("findAccount", () => {
  test("finds account by name and type", async () => {
    const input: CreateAccountInput = {
      name: "Test Checking",
      type: "checking",
      openingBalance: 1000,
    };

    const account = await findAccount(input);

    expect(account).toEqual({
      id: 1,
      name: "Test Checking",
      type: "checking",
      openingBalance: 1000,
    });
  });


  test("returns undefined when account is not found", async () => {
    const input: CreateAccountInput = {
      name: "Does Not Exist",
      type: "checking",
      openingBalance: 100,
    };

    const account = await findAccount(input);

    expect(account).toBeUndefined();
  });
});


// ======================================================
// POST
// ======================================================

describe("postAccount", () => {
  test("inserts and returns a new account", async () => {
    const input: CreateAccountInput = {
      name: "New Cash Account",
      type: "cash",
      openingBalance: 250.5,
    };

    const createdAccount = await postAccount(input);

    expect(createdAccount).toEqual({
      id: 3,
      name: "New Cash Account",
      type: "cash",
      openingBalance: 250.5,
    });

    const storedAccount = await getAccount(3);

    expect(storedAccount).toEqual(createdAccount);
  });
});


// ======================================================
// DELETE
// ======================================================

describe("deleteAccount", () => {
  test("deletes and returns an existing account", async () => {
    const deletedAccount = await deleteAccount(2);

    expect(deletedAccount).toEqual({
      id: 2,
      name: "Test Savings",
      type: "savings",
      openingBalance: 500,
    });

    const accountAfterDelete =
      await getAccount(2);

    expect(accountAfterDelete)
      .toBeUndefined();
  });


  test("returns undefined when account does not exist", async () => {
    const result = await deleteAccount(999);

    expect(result).toBeUndefined();
  });
});


// ======================================================
// PUT
// ======================================================

describe("putAccount", () => {
  test("fully replaces an existing account", async () => {
    const input: CreateAccountInput = {
      name: "Updated Checking",
      type: "investment",
      openingBalance: 5000,
    };

    const updatedAccount = await putAccount(
      1,
      input,
    );

    expect(updatedAccount).toEqual({
      id: 1,
      name: "Updated Checking",
      type: "investment",
      openingBalance: 5000,
    });

    const storedAccount = await getAccount(1);

    expect(storedAccount).toEqual(
      updatedAccount,
    );
  });


  test("returns undefined when account does not exist", async () => {
    const input: CreateAccountInput = {
      name: "Missing",
      type: "checking",
      openingBalance: 100,
    };

    const result = await putAccount(
      999,
      input,
    );

    expect(result).toBeUndefined();
  });
});


// ======================================================
// PATCH
// ======================================================

describe("updateAccount", () => {
  test("updates only supplied fields", async () => {
    const input: UpdateAccountInput = {
      openingBalance: 1750,
    };

    const updatedAccount =
      await updateAccount(1, input);

    expect(updatedAccount).toEqual({
      id: 1,

      // unchanged
      name: "Test Checking",
      type: "checking",

      // changed
      openingBalance: 1750,
    });
  });


  test("can update multiple supplied fields", async () => {
    const input: UpdateAccountInput = {
      name: "Renamed Savings",
      openingBalance: 800,
    };

    const updatedAccount =
      await updateAccount(2, input);

    expect(updatedAccount).toEqual({
      id: 2,
      name: "Renamed Savings",
      type: "savings",
      openingBalance: 800,
    });
  });


  test("returns undefined when account does not exist", async () => {
    const input: UpdateAccountInput = {
      name: "Missing",
    };

    const result = await updateAccount(
      999,
      input,
    );

    expect(result).toBeUndefined();
  });
});