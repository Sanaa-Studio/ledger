import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Account } from "@ledger/contracts";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import TransactionsPage from "./transactions";
import {
  createTransaction,
  getAllAccounts,
  getTransactions,
} from "../api/client";

vi.mock("../api/client", () => ({
  createTransaction: vi.fn(),
  getAllAccounts: vi.fn(),
  getTransactions: vi.fn(),
}));

const accounts: Account[] = [
  { id: 1, name: "Chase Checking", type: "checking", openingBalance: 1500 },
  { id: 2, name: "Ally Savings", type: "savings", openingBalance: 5000 },
];

const renderTransactionsPage = () =>
  render(
    <MemoryRouter initialEntries={["/transactions"]}>
      <Routes>
        <Route path="/transactions" element={<TransactionsPage />} />
      </Routes>
    </MemoryRouter>,
  );

describe("TransactionsPage create flow", () => {
  beforeEach(() => {
    vi.mocked(getTransactions).mockResolvedValue({
      data: [],
      meta: { page: 1, limit: 10, total: 0, pages: 0 },
    });
    vi.mocked(getAllAccounts).mockResolvedValue(accounts);
    vi.mocked(createTransaction).mockResolvedValue({
      id: 10,
      accountId: 1,
      destinationAccountId: null,
      amount: -52.16,
      description: "Groceries",
      date: new Date("2026-06-01T00:00:00.000Z"),
    });
  });

  it("submits a new transaction to the connected API client", async () => {
    const user = userEvent.setup();
    renderTransactionsPage();

    await screen.findByText("No transactions yet");
    await user.click(
      screen.getAllByRole("button", { name: /add transaction/i })[0]!,
    );
    await user.type(screen.getByLabelText("Amount"), "52.16");
    await user.type(screen.getByLabelText("Description"), "Groceries");
    await user.click(
      within(screen.getByRole("dialog")).getByRole("button", {
        name: "Add transaction",
      }),
    );

    expect(createTransaction).toHaveBeenCalledWith(
      expect.objectContaining({
        accountId: 1,
        amount: -52.16,
        description: "Groceries",
      }),
    );
  });
});
