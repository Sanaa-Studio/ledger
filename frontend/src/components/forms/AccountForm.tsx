import { useState, type FormEvent } from "react";
import {
  AccountTypeSchema,
  CreateAccountSchema,
  UpdateAccountSchema,
  type Account,
  type CreateAccountInput,
  type UpdateAccountInput,
} from "@ledger/contracts";
import { ACCOUNT_TYPES, ACCOUNT_TYPE_LABELS } from "../../ui/config";
import { Button, Notice } from "../../ui/Primitives";

type AccountFormValue = CreateAccountInput | UpdateAccountInput;

const AccountForm = ({
  account,
  onSave,
  onCancel,
}: {
  account?: Account;
  onSave: (value: AccountFormValue) => Promise<void>;
  onCancel: () => void;
}) => {
  const [name, setName] = useState(account?.name ?? "");
  const [type, setType] = useState<Account["type"]>(
    account?.type ?? "checking",
  );
  const [openingBalance, setOpeningBalance] = useState(
    account?.openingBalance.toString() ?? "0",
  );
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const input = account
      ? UpdateAccountSchema.safeParse({
          name,
          type,
          openingBalance: Number(openingBalance),
        })
      : CreateAccountSchema.safeParse({
          name,
          type,
          openingBalance: Number(openingBalance),
        });

    if (!input.success) {
      setError(input.error.issues[0]?.message ?? "Check the account details.");
      return;
    }

    try {
      setSubmitting(true);
      await onSave(input.data);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Could not save this account.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="form-stack" onSubmit={handleSubmit}>
      <label className="field">
        <span>Account name</span>
        <input
          autoFocus
          required
          maxLength={100}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Everyday checking"
        />
      </label>
      <label className="field">
        <span>Account type</span>
        <select
          value={type}
          onChange={(event) => {
            const parsed = AccountTypeSchema.safeParse(event.target.value);
            if (parsed.success) setType(parsed.data);
          }}
        >
          {ACCOUNT_TYPES.map((accountType) => (
            <option key={accountType} value={accountType}>
              {ACCOUNT_TYPE_LABELS[accountType]}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Opening balance</span>
        <div className="input-with-prefix">
          <span>$</span>
          <input
            aria-label="Opening balance"
            required
            type="number"
            step="0.01"
            value={openingBalance}
            onChange={(event) => setOpeningBalance(event.target.value)}
          />
        </div>
        <small>
          Starting amount before recorded transactions. Use a negative amount
          for a balance owed.
        </small>
      </label>
      {error && <Notice>{error}</Notice>}
      <div className="form-actions">
        <Button type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? "Saving…" : account ? "Save changes" : "Create account"}
        </Button>
      </div>
    </form>
  );
};

export default AccountForm;
