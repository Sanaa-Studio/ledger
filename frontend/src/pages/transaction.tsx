import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import base62 from "@sindresorhus/base62";
import type {
  Account,
  CreateTransactionInput,
  Transaction,
  UpdateTransactionInput,
} from "@ledger/contracts";
import {
  deleteTransaction,
  getAllAccounts,
  getTransaction,
  updateTransaction,
} from "../api/client";
import { ACCOUNT_TYPE_LABELS } from "../ui/config";
import { currency, dateLabel, transactionMode } from "../ui/format";
import {
  Badge,
  Button,
  Card,
  ErrorMessage,
  LoadingState,
  Modal,
  Notice,
  PageHeader,
} from "../ui/Primitives";
import TransactionForm from "../components/forms/TransactionForm";

const TransactionPage = () => {
  const { transactionId: encodedId } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        if (!encodedId) throw new Error("Transaction not found.");
        const id = base62.decodeInteger(encodedId);
        const [result, allAccounts] = await Promise.all([
          getTransaction(id),
          getAllAccounts(),
        ]);
        if (active) {
          setTransaction(result);
          setAccounts(allAccounts);
        }
      } catch (loadError) {
        if (active)
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Could not load this transaction.",
          );
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, [encodedId]);

  const save = async (
    value: CreateTransactionInput | UpdateTransactionInput,
  ) => {
    if (!transaction) return;
    const updated = await updateTransaction(
      transaction.id,
      value as UpdateTransactionInput,
    );
    setTransaction(updated);
    setEditing(false);
  };

  const remove = async () => {
    if (!transaction) return;
    try {
      setDeleting(true);
      await deleteTransaction(transaction.id);
      navigate("/transactions", { replace: true });
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Could not delete this transaction.",
      );
      setConfirmDelete(false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <LoadingState label="Loading transaction" />;
  if (error && !transaction) return <ErrorMessage message={error} />;
  if (!transaction) return <ErrorMessage message="Transaction not found." />;

  const source = accounts.find(
    (account) => account.id === transaction.accountId,
  );
  const destination = accounts.find(
    (account) => account.id === transaction.destinationAccountId,
  );
  const mode = transactionMode(transaction);

  return (
    <div className="page-stack">
      <Link className="back-link" to="/transactions">
        ← Transactions
      </Link>
      <PageHeader
        title={transaction.description || "Transaction"}
        description={dateLabel(transaction.date)}
        action={
          <>
            <Button onClick={() => setEditing(true)}>Edit</Button>
            <Button variant="danger" onClick={() => setConfirmDelete(true)}>
              Delete
            </Button>
          </>
        }
      />
      {error && <ErrorMessage message={error} />}
      <div className="detail-grid">
        <Card className="detail-balance">
          <span className="metric-card__label">Amount</span>
          <strong
            className={`metric-card__value ${transaction.amount >= 0 ? "amount-positive" : "amount-negative"}`}
          >
            {currency(transaction.amount)}
          </strong>
          <Badge
            tone={
              mode === "income"
                ? "positive"
                : mode === "expense"
                  ? "negative"
                  : "neutral"
            }
          >
            {mode}
          </Badge>
        </Card>
        <Card className="detail-note">
          <h2>Transaction details</h2>
          <dl className="detail-list">
            <div>
              <dt>Account</dt>
              <dd>
                {source ? (
                  <Link to={`/accounts/${base62.encodeInteger(source.id)}`}>
                    {source.name}
                  </Link>
                ) : (
                  "Unknown account"
                )}
              </dd>
            </div>
            {destination && (
              <div>
                <dt>Destination</dt>
                <dd>
                  <Link
                    to={`/accounts/${base62.encodeInteger(destination.id)}`}
                  >
                    {destination.name}
                  </Link>
                </dd>
              </div>
            )}
            <div>
              <dt>Account type</dt>
              <dd>{source ? ACCOUNT_TYPE_LABELS[source.type] : "—"}</dd>
            </div>
            <div>
              <dt>Description</dt>
              <dd>{transaction.description || "—"}</dd>
            </div>
          </dl>
        </Card>
      </div>
      {editing && (
        <Modal
          title="Edit transaction"
          description="Update the details and save your changes."
          onClose={() => setEditing(false)}
          wide
        >
          <TransactionForm
            accounts={accounts}
            transaction={transaction}
            onCancel={() => setEditing(false)}
            onSave={save}
          />
        </Modal>
      )}
      {confirmDelete && (
        <Modal
          title="Delete transaction?"
          description="This transaction will be permanently removed."
          onClose={() => setConfirmDelete(false)}
        >
          <div className="confirm-content">
            <Notice>
              This will change the balance shown for{" "}
              {source?.name ?? "the account"}.
            </Notice>
            <div className="form-actions">
              <Button onClick={() => setConfirmDelete(false)}>Cancel</Button>
              <Button
                variant="danger"
                disabled={deleting}
                onClick={() => void remove()}
              >
                {deleting ? "Deleting…" : "Delete transaction"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TransactionPage;
