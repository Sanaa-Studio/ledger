import { useState, type FormEvent } from "react";
import {
  CreateTransactionSchema,
  UpdateTransactionSchema,
  type Account,
  type CreateTransactionInput,
  type Transaction,
  type UpdateTransactionInput,
} from "@ledger/contracts";
import {
  dateInputValue,
  todayInputValue,
  transactionMode,
} from "../../ui/format";
import { Button, Notice } from "../../ui/Primitives";

type TransactionMode = "expense" | "income" | "transfer";

const TransactionForm = ({
  accounts,
  transaction,
  onSave,
  onCancel,
}: {
  accounts: Account[];
  transaction?: Transaction;
  onSave: (
    value: CreateTransactionInput | UpdateTransactionInput,
  ) => Promise<void>;
  onCancel: () => void;
}) => {
  const initialMode = transaction ? transactionMode(transaction) : "expense";
  const [mode, setMode] = useState<TransactionMode>(initialMode);
  const [accountId, setAccountId] = useState(
    String(transaction?.accountId ?? accounts[0]?.id ?? ""),
  );
  const [destinationAccountId, setDestinationAccountId] = useState(
    String(transaction?.destinationAccountId ?? ""),
  );
  const [amount, setAmount] = useState(
    Math.abs(transaction?.amount ?? 0).toString(),
  );
  const [description, setDescription] = useState(
    transaction?.description ?? "",
  );
  const [date, setDate] = useState(
    transaction ? dateInputValue(transaction.date) : todayInputValue(),
  );
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const amountValue = Number(amount);
    const signedAmount =
      mode === "income" ? Math.abs(amountValue) : -Math.abs(amountValue);
    const input = {
      accountId: Number(accountId),
      destinationAccountId:
        mode === "transfer" ? Number(destinationAccountId) : undefined,
      amount: signedAmount,
      description: description.trim() || undefined,
      date: new Date(`${date}T00:00:00.000Z`),
    };
    const parsed = transaction
      ? UpdateTransactionSchema.safeParse({
          ...input,
          destinationAccountId:
            mode === "transfer" ? Number(destinationAccountId) : null,
          description: description.trim() || null,
        })
      : CreateTransactionSchema.safeParse(input);

    if (!parsed.success) {
      setError(
        parsed.error.issues[0]?.message ?? "Check the transaction details.",
      );
      return;
    }

    try {
      setSubmitting(true);
      await onSave(parsed.data);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Could not save this transaction.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="form-stack" onSubmit={handleSubmit}>
      <label className="field">
        <span>Transaction type</span>
        <select
          value={mode}
          onChange={(event) => setMode(event.target.value as TransactionMode)}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
          <option value="transfer">Transfer</option>
        </select>
      </label>
      <div className="form-grid">
        <label className="field">
          <span>{mode === "transfer" ? "From account" : "Account"}</span>
          <select
            required
            value={accountId}
            onChange={(event) => setAccountId(event.target.value)}
          >
            <option value="" disabled>
              Select an account
            </option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
        </label>
        {mode === "transfer" && (
          <label className="field">
            <span>To account</span>
            <select
              required
              value={destinationAccountId}
              onChange={(event) => setDestinationAccountId(event.target.value)}
            >
              <option value="" disabled>
                Select an account
              </option>
              {accounts
                .filter((account) => String(account.id) !== accountId)
                .map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
            </select>
          </label>
        )}
      </div>
      <div className="form-grid">
        <label className="field">
          <span>Amount</span>
          <div className="input-with-prefix">
            <span>$</span>
            <input
              aria-label="Amount"
              autoFocus
              type="number"
              min="0.01"
              step="0.01"
              required
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
          </div>
        </label>
        <label className="field">
          <span>Date</span>
          <input
            type="date"
            required
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </label>
      </div>
      <label className="field">
        <span>Description</span>
        <input
          maxLength={255}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Merchant or note"
        />
      </label>
      {error && <Notice>{error}</Notice>}
      {accounts.length === 0 && (
        <Notice tone="info">
          Create an account before adding transactions.
        </Notice>
      )}
      <div className="form-actions">
        <Button type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={submitting || accounts.length === 0}
        >
          {submitting
            ? "Saving…"
            : transaction
              ? "Save changes"
              : "Add transaction"}
        </Button>
      </div>
    </form>
  );
};

export default TransactionForm;
