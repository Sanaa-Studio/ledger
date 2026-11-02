import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Account } from "@ledger/contracts";
import AccountPage from "./account";
import { deleteAccount, getAccount, updateAccount } from "../api/client";

vi.mock("../api/client", () => ({
  deleteAccount: vi.fn(),
  getAccount: vi.fn(),
  updateAccount: vi.fn(),
}));

const account: Account = {
  id: 1,
  name: "Chase Checking",
  type: "checking",
  openingBalance: 1500,
};

const renderAccountPage = () =>
  render(
    <MemoryRouter initialEntries={["/accounts/1"]}>
      <Routes>
        <Route path="/accounts/:accountId" element={<AccountPage />} />
        <Route path="/accounts" element={<p>Accounts list</p>} />
      </Routes>
    </MemoryRouter>,
  );

describe("AccountPage CRUD actions", () => {
  beforeEach(() => {
    vi.mocked(getAccount).mockResolvedValue(account);
    vi.mocked(updateAccount).mockResolvedValue({
      ...account,
      name: "Everyday checking",
    });
    vi.mocked(deleteAccount).mockResolvedValue(account);
  });

  it("saves account edits through the API client", async () => {
    const user = userEvent.setup();
    renderAccountPage();

    await screen.findByRole("heading", { name: "Chase Checking" });
    await user.click(screen.getByRole("button", { name: "Edit account" }));
    await user.clear(screen.getByLabelText("Account name"));
    await user.type(screen.getByLabelText("Account name"), "Everyday checking");
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(updateAccount).toHaveBeenCalledWith(1, {
      name: "Everyday checking",
      type: "checking",
      openingBalance: 1500,
    });
    expect(
      await screen.findByRole("heading", { name: "Everyday checking" }),
    ).toBeInTheDocument();
  });

  it("confirms account deletion and returns to the accounts list", async () => {
    const user = userEvent.setup();
    renderAccountPage();

    await screen.findByRole("heading", { name: "Chase Checking" });
    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(
      await screen.findByText(/also deletes its associated transactions/i),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Delete account" }));

    expect(deleteAccount).toHaveBeenCalledWith(1);
    expect(await screen.findByText("Accounts list")).toBeInTheDocument();
  });
});
