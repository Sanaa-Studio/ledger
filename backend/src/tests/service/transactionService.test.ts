import { beforeEach, describe, expect, test, jest } from "@jest/globals";

import { fakeTransactions } from "../fakeData/transactions/fakedTransactions.js";
import { fakeAccounts } from "../fakeData/accounts/fakedAccounts.js";

import type {
  Transaction,
  CreateTransactionInput,
  UpdateTransactionInput,
} from "@ledger/contracts";

import type { TransactionQueryResponse } from "@ledger/contracts";

import { BadRequestError, NotFoundError } from "../../errors/AppError.js";

// ======================================================
// Transaction repository mocks
// ======================================================

const getTransactionsMock = jest.fn(
  async (offset: number, limit: number): Promise<Transaction[]> =>
    fakeTransactions.slice(offset, offset + limit),
);

const getTransactionsCountMock = jest.fn(
  async (): Promise<number> => fakeTransactions.length,
);

const getTransactionMock = jest.fn(
  async (id: number): Promise<Transaction | undefined> =>
    fakeTransactions.find((transaction) => transaction.id === id),
);

const postTransactionMock = jest.fn(
  async (_input: CreateTransactionInput): Promise<Transaction> =>
    fakeTransactions[0]!,
);

const putTransactionMock = jest.fn(
  async (
    _id: number,
    _input: CreateTransactionInput,
  ): Promise<Transaction | undefined> => undefined,
);

const updateTransactionMock = jest.fn(
  async (
    _id: number,
    _input: UpdateTransactionInput,
  ): Promise<Transaction | undefined> => undefined,
);

const deleteTransactionMock = jest.fn(
  async (_id: number): Promise<Transaction | undefined> => undefined,
);

// ======================================================
// Account repository mock
// ======================================================

const getAccountMock = jest.fn(async (id: number) =>
  fakeAccounts.find((account) => account.id === id),
);

// ======================================================
// Replace repositories
// ======================================================

jest.unstable_mockModule("../../repository/transactionsRepository.js", () => ({
  getTransactions: getTransactionsMock,
  getTransactionsCount: getTransactionsCountMock,
  getTransaction: getTransactionMock,
  postTransaction: postTransactionMock,
  putTransaction: putTransactionMock,
  updateTransaction: updateTransactionMock,
  deleteTransaction: deleteTransactionMock,
}));

jest.unstable_mockModule("../../repository/accountsRepository.js", () => ({
  getAccount: getAccountMock,
}));

// IMPORTANT: import service after mocks
const {
  fetchTransactions,
  fetchTransaction,
  makeTransaction,
  replaceTransaction,
  patchTransaction,
  removeTransaction,
} = await import("../../services/transactionsService.js");

beforeEach(() => {
  jest.clearAllMocks();
});

// ======================================================
// GET ALL
// ======================================================

describe("fetchTransactions", () => {
  test("successfully fetches first page", async () => {
    const expected: TransactionQueryResponse = {
      data: fakeTransactions.slice(0, 3),
      page: 1,
      limit: 3,
      total: fakeTransactions.length,
      pages: Math.ceil(fakeTransactions.length / 3),
    };

    const result = await fetchTransactions({
      page: 1,
      limit: 3,
    });

    expect(result).toEqual(expected);

    expect(getTransactionsMock).toHaveBeenCalledWith(0, 3);

    expect(getTransactionsCountMock).toHaveBeenCalledTimes(1);
  });

  test("successfully fetches second page", async () => {
    const result = await fetchTransactions({
      page: 2,
      limit: 3,
    });

    expect(result.data).toEqual(fakeTransactions.slice(3, 6));

    expect(result.page).toBe(2);
    expect(result.limit).toBe(3);
    expect(result.total).toBe(fakeTransactions.length);

    expect(getTransactionsMock).toHaveBeenCalledWith(3, 3);
  });

  test("returns empty data when page exceeds available transactions", async () => {
    const result = await fetchTransactions({
      page: 100,
      limit: 3,
    });

    expect(result.data).toEqual([]);

    expect(result.total).toBe(fakeTransactions.length);

    expect(getTransactionsMock).toHaveBeenCalledWith(297, 3);
  });

  test("calculates page count correctly", async () => {
    const result = await fetchTransactions({
      page: 1,
      limit: 5,
    });

    expect(result.pages).toBe(Math.ceil(fakeTransactions.length / 5));
  });
});

// ======================================================
// GET ONE
// ======================================================

describe("fetchTransaction", () => {
  test("successfully fetches transaction", async () => {
    const transaction = fakeTransactions[0]!;

    const result = await fetchTransaction(transaction.id);

    expect(result).toEqual(transaction);

    expect(getTransactionMock).toHaveBeenCalledWith(transaction.id);
  });

  test("throws NotFoundError when transaction does not exist", async () => {
    getTransactionMock.mockResolvedValueOnce(undefined);

    await expect(fetchTransaction(999)).rejects.toBeInstanceOf(NotFoundError);

    expect(getTransactionMock).toHaveBeenCalledWith(999);
  });
});

// ======================================================
// POST
// ======================================================

describe("makeTransaction", () => {
  test("successfully creates a normal transaction", async () => {
    const input: CreateTransactionInput = {
      accountId: 1,
      amount: -100,
      description: "Restaurant",
      date: new Date("2026-08-20"),
    };

    const createdTransaction: Transaction = {
      id: 9,
      accountId: 1,
      destinationAccountId: null,
      amount: -100,
      description: "Restaurant",
      date: new Date("2026-08-20"),
    };

    postTransactionMock.mockResolvedValueOnce(createdTransaction);

    const result = await makeTransaction(input);

    expect(result).toEqual(createdTransaction);

    expect(getAccountMock).toHaveBeenCalledWith(1);

    expect(postTransactionMock).toHaveBeenCalledWith(input);
  });

  test("successfully creates a transfer", async () => {
    const input: CreateTransactionInput = {
      accountId: 1,
      destinationAccountId: 2,
      amount: -500,
      description: "Transfer to savings",
      date: new Date("2026-08-20"),
    };

    const createdTransaction: Transaction = {
      id: 9,
      accountId: 1,
      destinationAccountId: 2,
      amount: -500,
      description: "Transfer to savings",
      date: new Date("2026-08-20"),
    };

    postTransactionMock.mockResolvedValueOnce(createdTransaction);

    const result = await makeTransaction(input);

    expect(result).toEqual(createdTransaction);

    expect(getAccountMock).toHaveBeenCalledWith(1);

    expect(getAccountMock).toHaveBeenCalledWith(2);

    expect(postTransactionMock).toHaveBeenCalledWith(input);
  });

  test("throws BadRequestError when origin account does not exist", async () => {
    const input: CreateTransactionInput = {
      accountId: 999,
      amount: -100,
      date: new Date("2026-08-20"),
    };

    await expect(makeTransaction(input)).rejects.toBeInstanceOf(
      BadRequestError,
    );

    expect(getAccountMock).toHaveBeenCalledWith(999);

    expect(postTransactionMock).not.toHaveBeenCalled();
  });

  test("throws BadRequestError when destination account does not exist", async () => {
    const input: CreateTransactionInput = {
      accountId: 1,
      destinationAccountId: 999,
      amount: -100,
      date: new Date("2026-08-20"),
    };

    await expect(makeTransaction(input)).rejects.toBeInstanceOf(
      BadRequestError,
    );

    expect(getAccountMock).toHaveBeenCalledWith(1);

    expect(getAccountMock).toHaveBeenCalledWith(999);

    expect(postTransactionMock).not.toHaveBeenCalled();
  });

  test("throws BadRequestError when origin and destination are the same", async () => {
    const input: CreateTransactionInput = {
      accountId: 1,
      destinationAccountId: 1,
      amount: -100,
      date: new Date("2026-08-20"),
    };

    await expect(makeTransaction(input)).rejects.toBeInstanceOf(
      BadRequestError,
    );

    expect(postTransactionMock).not.toHaveBeenCalled();
  });
});

// ======================================================
// PUT
// ======================================================

describe("replaceTransaction", () => {
  test("successfully replaces transaction", async () => {
    const existingTransaction = fakeTransactions[6]!;

    const input: CreateTransactionInput = {
      accountId: 1,
      destinationAccountId: 2,
      amount: -750,
      description: "Updated transfer",
      date: new Date("2026-08-20"),
    };

    const updatedTransaction: Transaction = {
      id: existingTransaction.id,
      accountId: 1,
      destinationAccountId: 2,
      amount: -750,
      description: "Updated transfer",
      date: new Date("2026-08-20"),
    };

    putTransactionMock.mockResolvedValueOnce(updatedTransaction);

    const result = await replaceTransaction(input, existingTransaction.id);

    expect(result).toEqual(updatedTransaction);

    expect(getTransactionMock).toHaveBeenCalledWith(existingTransaction.id);

    expect(getAccountMock).toHaveBeenCalledWith(1);

    expect(getAccountMock).toHaveBeenCalledWith(2);

    expect(putTransactionMock).toHaveBeenCalledWith(
      existingTransaction.id,
      input,
    );
  });

  test("throws NotFoundError when transaction does not exist", async () => {
    getTransactionMock.mockResolvedValueOnce(undefined);

    const input: CreateTransactionInput = {
      accountId: 1,
      amount: -100,
      date: new Date("2026-08-20"),
    };

    await expect(replaceTransaction(input, 999)).rejects.toBeInstanceOf(
      NotFoundError,
    );

    expect(putTransactionMock).not.toHaveBeenCalled();
  });

  test("throws BadRequestError when replacement accounts are invalid", async () => {
    const input: CreateTransactionInput = {
      accountId: 1,
      destinationAccountId: 1,
      amount: -100,
      date: new Date("2026-08-20"),
    };

    await expect(
      replaceTransaction(input, fakeTransactions[0]!.id),
    ).rejects.toBeInstanceOf(BadRequestError);

    expect(putTransactionMock).not.toHaveBeenCalled();
  });

  test("throws NotFoundError when repository fails to return updated transaction", async () => {
    const input: CreateTransactionInput = {
      accountId: 1,
      amount: -100,
      date: new Date("2026-08-20"),
    };

    putTransactionMock.mockResolvedValueOnce(undefined);

    await expect(
      replaceTransaction(input, fakeTransactions[0]!.id),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});

// ======================================================
// PATCH
// ======================================================

describe("patchTransaction", () => {
  test("successfully patches transaction amount", async () => {
    const existingTransaction = fakeTransactions[1]!;

    const input: UpdateTransactionInput = {
      amount: -75,
    };

    const updatedTransaction: Transaction = {
      ...existingTransaction,
      amount: -75,
    };

    updateTransactionMock.mockResolvedValueOnce(updatedTransaction);

    const result = await patchTransaction(input, existingTransaction.id);

    expect(result).toEqual(updatedTransaction);

    expect(getTransactionMock).toHaveBeenCalledWith(existingTransaction.id);

    // existing source account is still validated
    expect(getAccountMock).toHaveBeenCalledWith(existingTransaction.accountId);

    expect(updateTransactionMock).toHaveBeenCalledWith(
      existingTransaction.id,
      input,
    );
  });

  test("successfully removes destination account with null", async () => {
    const transfer = fakeTransactions.find(
      (transaction) => transaction.destinationAccountId !== null,
    )!;

    const input: UpdateTransactionInput = {
      destinationAccountId: null,
    };

    const updatedTransaction: Transaction = {
      ...transfer,
      destinationAccountId: null,
    };

    updateTransactionMock.mockResolvedValueOnce(updatedTransaction);

    const result = await patchTransaction(input, transfer.id);

    expect(result.destinationAccountId).toBeNull();

    expect(updateTransactionMock).toHaveBeenCalledWith(transfer.id, input);
  });

  test("throws NotFoundError when patched transaction does not exist", async () => {
    getTransactionMock.mockResolvedValueOnce(undefined);

    const input: UpdateTransactionInput = {
      amount: -100,
    };

    await expect(patchTransaction(input, 999)).rejects.toBeInstanceOf(
      NotFoundError,
    );

    expect(updateTransactionMock).not.toHaveBeenCalled();
  });

  test("throws BadRequestError when patch makes origin and destination the same", async () => {
    const transfer = fakeTransactions.find(
      (transaction) => transaction.destinationAccountId !== null,
    )!;

    const input: UpdateTransactionInput = {
      destinationAccountId: transfer.accountId,
    };

    await expect(patchTransaction(input, transfer.id)).rejects.toBeInstanceOf(
      BadRequestError,
    );

    expect(updateTransactionMock).not.toHaveBeenCalled();
  });

  test("throws BadRequestError when patched destination account does not exist", async () => {
    const input: UpdateTransactionInput = {
      destinationAccountId: 999,
    };

    await expect(
      patchTransaction(input, fakeTransactions[0]!.id),
    ).rejects.toBeInstanceOf(BadRequestError);

    expect(updateTransactionMock).not.toHaveBeenCalled();
  });

  test("throws NotFoundError when repository fails to return patched transaction", async () => {
    const input: UpdateTransactionInput = {
      amount: -200,
    };

    updateTransactionMock.mockResolvedValueOnce(undefined);

    await expect(
      patchTransaction(input, fakeTransactions[0]!.id),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});

// ======================================================
// DELETE
// ======================================================

describe("removeTransaction", () => {
  test("successfully removes transaction", async () => {
    const transaction = fakeTransactions[0]!;

    deleteTransactionMock.mockResolvedValueOnce(transaction);

    const result = await removeTransaction(transaction.id);

    expect(result).toEqual(transaction);

    expect(deleteTransactionMock).toHaveBeenCalledWith(transaction.id);
  });

  test("throws NotFoundError when transaction does not exist", async () => {
    deleteTransactionMock.mockResolvedValueOnce(undefined);

    await expect(removeTransaction(999)).rejects.toBeInstanceOf(NotFoundError);

    expect(deleteTransactionMock).toHaveBeenCalledWith(999);
  });
});
