import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import { Modal } from "./Primitives";

it("keeps keyboard focus in a dialog and restores it on Escape", async () => {
  const user = userEvent.setup();
  const Example = () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button onClick={() => setOpen(true)}>Edit account</button>
        {open && (
          <Modal title="Edit account" onClose={() => setOpen(false)}>
            <input aria-label="Name" />
            <button>Save</button>
          </Modal>
        )}
      </>
    );
  };
  render(<Example />);
  const trigger = screen.getByRole("button", { name: "Edit account" });
  await user.click(trigger);
  expect(screen.getByRole("dialog")).toHaveFocus();
  expect(document.body.style.overflow).toBe("hidden");
  await user.tab({ shift: true });
  expect(screen.getByRole("button", { name: "Save" })).toHaveFocus();
  await user.tab();
  expect(screen.getByRole("button", { name: "Close dialog" })).toHaveFocus();
  await user.tab({ shift: true });
  expect(screen.getByRole("button", { name: "Save" })).toHaveFocus();
  await user.keyboard("{Escape}");
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
  expect(document.body.style.overflow).toBe("");
});
