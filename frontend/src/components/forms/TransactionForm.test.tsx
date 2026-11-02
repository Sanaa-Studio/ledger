import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Account } from "@ledger/contracts";
import { describe, expect, it, vi } from "vitest";
import TransactionForm from "./TransactionForm";

const accounts: Account[] = [
  { id: 1, name: "Chase Checking", type: "checking", openingBalance: 1500 },
  { id: 2, name: "Ally Savings", type: "savings", openingBalance: 5000 },
];

describe("TransactionForm", () => {
  it("submits a signed expense with the selected account and date", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn().mockResolvedValue(undefined);
    render(
      <TransactionForm
        accounts={accounts}
        onSave={onSave}
        onCancel={vi.fn()}
      />,
    );

    await user.type(screen.getByLabelText("Amount"), "52.16");
    await user.type(screen.getByLabelText("Description"), "Groceries");
    await user.click(screen.getByRole("button", { name: "Add transaction" }));

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave.mock.calls[0]?.[0]).toMatchObject({
      accountId: 1,
      amount: -52.16,
      description: "Groceries",
    });
    expect(onSave.mock.calls[0]?.[0].date).toBeInstanceOf(Date);
  });

  it("requires a different destination account for a transfer", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn().mockResolvedValue(undefined);
    render(
      <TransactionForm
        accounts={accounts}
        onSave={onSave}
        onCancel={vi.fn()}
      />,
    );

    await user.selectOptions(
      screen.getByLabelText("Transaction type"),
      "transfer",
    );
    await user.selectOptions(screen.getByLabelText("To account"), "2");
    await user.type(screen.getByLabelText("Amount"), "300");
    await user.click(screen.getByRole("button", { name: "Add transaction" }));

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        accountId: 1,
        destinationAccountId: 2,
        amount: -300,
      }),
    );
  });
});
