import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import AccountForm from "./AccountForm";

describe("AccountForm", () => {
  it("validates and submits account creation through the shared schema", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn().mockResolvedValue(undefined);
    render(<AccountForm onSave={onSave} onCancel={vi.fn()} />);

    await user.type(screen.getByLabelText("Account name"), "Everyday checking");
    await user.clear(screen.getByLabelText("Opening balance"));
    await user.type(screen.getByLabelText("Opening balance"), "1250.50");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(onSave).toHaveBeenCalledWith({
      name: "Everyday checking",
      type: "checking",
      openingBalance: 1250.5,
    });
  });

  it("shows the Zod validation message for a whitespace-only name", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn().mockResolvedValue(undefined);
    render(<AccountForm onSave={onSave} onCancel={vi.fn()} />);

    await user.type(screen.getByLabelText("Account name"), "   ");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Account name is required",
    );
    expect(onSave).not.toHaveBeenCalled();
  });
});
