import {
  beforeEach,
  describe,
  expect,
  test,
  jest,
} from "@jest/globals";

import { fakeAccounts } from "../fakeData/accounts/fakedAccounts.js";

import type {
  Account,
  CreateAccountInput,
  UpdateAccountInput,
} from "@ledger/contracts";

import type { AccountQueryResponseType } from "@ledger/contracts";

import {
  NotFoundError,
  ConflictError,
} from "../../errors/AppError.js";


// -----------------------------
// Repository mocks
// -----------------------------

const getAccountsMock = jest.fn(
  async (offset: number, limit: number): Promise<Account[]> =>
    fakeAccounts.slice(offset, offset + limit),
);

const getAccountsCountMock = jest.fn(
  async (): Promise<number> => fakeAccounts.length,
);

const getAccountMock = jest.fn(
  async (_id: number): Promise<Account | undefined> =>
    undefined,
);

const findAccountMock = jest.fn(
  async (
    _input: CreateAccountInput,
  ): Promise<Account | undefined> => undefined,
);

const postAccountMock = jest.fn(
  async (
    _input: CreateAccountInput,
  ): Promise<Account> => fakeAccounts[0]!,
);

const deleteAccountMock = jest.fn(
  async (_id: number): Promise<Account | undefined> =>
    undefined,
);

const putAccountMock = jest.fn(
  async (
    _id: number,
    _input: CreateAccountInput,
  ): Promise<Account | undefined> => undefined,
);

const updateAccountMock = jest.fn(
  async (
    _id: number,
    _input: UpdateAccountInput,
  ): Promise<Account | undefined> => undefined,
);


// -----------------------------
// Replace real repository
// -----------------------------

jest.unstable_mockModule(
  "../../repository/accountsRepository.js",
  () => ({
    getAccounts: getAccountsMock,
    getAccountsCount: getAccountsCountMock,
    getAccount: getAccountMock,
    findAccount: findAccountMock,
    postAccount: postAccountMock,
    deleteAccount: deleteAccountMock,
    putAccount: putAccountMock,
    updateAccount: updateAccountMock,
  }),
);


// Service must be imported AFTER the mock
const {
  fetchAccounts,
  fetchAccount,
  createAccount,
  removeAccount,
  replaceAccount,
  patchAccount,
} = await import("../../services/accountsService.js");


beforeEach(() => {
  jest.clearAllMocks();
});


// ======================================================
// GET ALL
// ======================================================

describe("fetchAccounts", () => {
  test("successfully fetches first page of accounts", async () => {
    const expected: AccountQueryResponseType = {
      data: fakeAccounts.slice(0, 3),
      page: 1,
      limit: 3,
      total: 6,
      pages: 2,
    };

    const result = await fetchAccounts({
      page: 1,
      limit: 3,
    });

    expect(result).toEqual(expected);

    expect(getAccountsMock)
      .toHaveBeenCalledWith(0, 3);

    expect(getAccountsCountMock)
      .toHaveBeenCalledTimes(1);
  });


  test("successfully fetches second page of accounts", async () => {
    const result = await fetchAccounts({
      page: 2,
      limit: 3,
    });

    expect(result.data).toEqual(
      fakeAccounts.slice(3, 6),
    );

    expect(result.page).toBe(2);
    expect(result.limit).toBe(3);
    expect(result.total).toBe(6);
    expect(result.pages).toBe(2);

    expect(getAccountsMock)
      .toHaveBeenCalledWith(3, 3);
  });


  test("returns empty data when page exceeds available accounts", async () => {
    const result = await fetchAccounts({
      page: 100,
      limit: 3,
    });

    expect(result.data).toEqual([]);
    expect(result.total).toBe(6);
    expect(result.pages).toBe(2);

    expect(getAccountsMock)
      .toHaveBeenCalledWith(297, 3);
  });


  test("calculates number of pages correctly", async () => {
    const result = await fetchAccounts({
      page: 1,
      limit: 4,
    });

    expect(result.pages).toBe(2);

    expect(getAccountsMock)
      .toHaveBeenCalledWith(0, 4);
  });
});


// ======================================================
// GET ONE
// ======================================================

describe("fetchAccount", () => {
  test("successfully fetches an account", async () => {
    const account = fakeAccounts[0]!;

    getAccountMock.mockResolvedValueOnce(account);

    const result = await fetchAccount(account.id);

    expect(result).toEqual(account);

    expect(getAccountMock)
      .toHaveBeenCalledWith(account.id);

    expect(getAccountMock)
      .toHaveBeenCalledTimes(1);
  });


  test("throws NotFoundError when account does not exist", async () => {
    getAccountMock.mockResolvedValueOnce(undefined);

    await expect(
      fetchAccount(999),
    ).rejects.toBeInstanceOf(NotFoundError);

    expect(getAccountMock)
      .toHaveBeenCalledWith(999);
  });
});


// ======================================================
// POST
// ======================================================

describe("createAccount", () => {
  const accountInput: CreateAccountInput = {
    name: "New Checking",
    type: "checking",
    openingBalance: 1000,
  };


  test("successfully creates an account", async () => {
    const createdAccount: Account = {
      id: 7,
      ...accountInput,
    };

    findAccountMock.mockResolvedValueOnce(undefined);

    postAccountMock.mockResolvedValueOnce(
      createdAccount,
    );

    const result = await createAccount(
      accountInput,
    );

    expect(result).toEqual(createdAccount);

    expect(findAccountMock)
      .toHaveBeenCalledWith(accountInput);

    expect(postAccountMock)
      .toHaveBeenCalledWith(accountInput);
  });


  test("throws ConflictError when account already exists", async () => {
    findAccountMock.mockResolvedValueOnce(
      fakeAccounts[0]!,
    );

    await expect(
      createAccount(accountInput),
    ).rejects.toBeInstanceOf(ConflictError);

    expect(findAccountMock)
      .toHaveBeenCalledWith(accountInput);

    expect(postAccountMock)
      .not.toHaveBeenCalled();
  });
});


// ======================================================
// DELETE
// ======================================================

describe("removeAccount", () => {
  test("successfully removes an account", async () => {
    const account = fakeAccounts[0]!;

    deleteAccountMock.mockResolvedValueOnce(
      account,
    );

    const result = await removeAccount(
      account.id,
    );

    expect(result).toEqual(account);

    expect(deleteAccountMock)
      .toHaveBeenCalledWith(account.id);
  });


  test("throws NotFoundError when deleting nonexistent account", async () => {
    deleteAccountMock.mockResolvedValueOnce(
      undefined,
    );

    await expect(
      removeAccount(999),
    ).rejects.toBeInstanceOf(NotFoundError);

    expect(deleteAccountMock)
      .toHaveBeenCalledWith(999);
  });
});


// ======================================================
// PUT
// ======================================================

describe("replaceAccount", () => {
  const replacement: CreateAccountInput = {
    name: "Updated Checking",
    type: "checking",
    openingBalance: 5000,
  };


  test("successfully replaces an account", async () => {
    const updatedAccount: Account = {
      id: 1,
      ...replacement,
    };

    putAccountMock.mockResolvedValueOnce(
      updatedAccount,
    );

    const result = await replaceAccount(
      replacement,
      1,
    );

    expect(result).toEqual(updatedAccount);

    expect(putAccountMock)
      .toHaveBeenCalledWith(
        1,
        replacement,
      );
  });


  test("throws NotFoundError when replacing nonexistent account", async () => {
    putAccountMock.mockResolvedValueOnce(
      undefined,
    );

    await expect(
      replaceAccount(replacement, 999),
    ).rejects.toBeInstanceOf(NotFoundError);

    expect(putAccountMock)
      .toHaveBeenCalledWith(
        999,
        replacement,
      );
  });
});


// ======================================================
// PATCH
// ======================================================

describe("patchAccount", () => {
  test("successfully patches an account", async () => {
    const update: UpdateAccountInput = {
      openingBalance: 3000,
    };

    const updatedAccount: Account = {
      ...fakeAccounts[0]!,
      openingBalance: 3000,
    };

    updateAccountMock.mockResolvedValueOnce(
      updatedAccount,
    );

    const result = await patchAccount(
      update,
      1,
    );

    expect(result).toEqual(updatedAccount);

    expect(updateAccountMock)
      .toHaveBeenCalledWith(
        1,
        update,
      );
  });


  test("throws NotFoundError when patching nonexistent account", async () => {
    const update: UpdateAccountInput = {
      name: "Updated Name",
    };

    updateAccountMock.mockResolvedValueOnce(
      undefined,
    );

    await expect(
      patchAccount(update, 999),
    ).rejects.toBeInstanceOf(NotFoundError);

    expect(updateAccountMock)
      .toHaveBeenCalledWith(
        999,
        update,
      );
  });
});