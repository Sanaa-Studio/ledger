import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import base62 from "@sindresorhus/base62";
import type {
  Account,
  CreateAccountInput,
  UpdateAccountInput,
} from "@ledger/contracts";
import { deleteAccount, getAccount, updateAccount } from "../api/client";
import { ACCOUNT_TYPE_LABELS } from "../ui/config";
import { currency } from "../ui/format";
import {
  Button,
  Card,
  ErrorMessage,
  LoadingState,
  Modal,
  Notice,
  PageHeader,
} from "../ui/Primitives";
import AccountForm from "../components/forms/AccountForm";

const AccountPage = () => {
  const { accountId: encodedId } = useParams();
  const navigate = useNavigate();
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        if (!encodedId) throw new Error("Account not found.");
        const id = base62.decodeInteger(encodedId);
        const result = await getAccount(id);
        if (active) {
          setAccount(result);
          setError(null);
        }
      } catch (loadError) {
        if (active)
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Could not load this account.",
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

  const saveAccount = async (
    value: CreateAccountInput | UpdateAccountInput,
  ) => {
    if (!account) return;
    const updated = await updateAccount(
      account.id,
      value as UpdateAccountInput,
    );
    setAccount(updated);
    setEditing(false);
  };

  const remove = async () => {
    if (!account) return;
    try {
      setDeleting(true);
      await deleteAccount(account.id);
      navigate("/accounts", { replace: true });
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Could not delete this account.",
      );
      setConfirmDelete(false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <LoadingState label="Loading account" />;
  if (error && !account)
    return (
      <ErrorMessage message={error} onRetry={() => window.location.reload()} />
    );
  if (!account) return <ErrorMessage message="Account not found." />;

  return (
    <div className="page-stack">
      <Link className="back-link" to="/accounts">
        ← Accounts
      </Link>
      <PageHeader
        title={account.name}
        description={ACCOUNT_TYPE_LABELS[account.type]}
        action={
          <>
            <Button onClick={() => setEditing(true)}>Edit account</Button>
            <Button variant="danger" onClick={() => setConfirmDelete(true)}>
              Delete
            </Button>
          </>
        }
      />
      {error && <ErrorMessage message={error} />}
      <div className="detail-grid">
        <Card className="detail-balance">
          <span className="metric-card__label">Opening balance</span>
          <strong className="metric-card__value">
            {currency(account.openingBalance)}
          </strong>
          <span className="muted">
            Transactions are listed separately in the activity view.
          </span>
        </Card>
        <Card className="detail-note">
          <h2>Account details</h2>
          <dl className="detail-list">
            <div>
              <dt>Account name</dt>
              <dd>{account.name}</dd>
            </div>
            <div>
              <dt>Type</dt>
              <dd>{ACCOUNT_TYPE_LABELS[account.type]}</dd>
            </div>
            <div>
              <dt>Account ID</dt>
              <dd>•••• {String(account.id).slice(-4)}</dd>
            </div>
          </dl>
        </Card>
      </div>
      {editing && (
        <Modal
          title="Edit account"
          description="Update the name, type, or opening balance."
          onClose={() => setEditing(false)}
        >
          <AccountForm
            account={account}
            onCancel={() => setEditing(false)}
            onSave={saveAccount}
          />
        </Modal>
      )}
      {confirmDelete && (
        <Modal
          title="Delete account?"
          description="This action cannot be undone."
          onClose={() => setConfirmDelete(false)}
        >
          <div className="confirm-content">
            <Notice>
              Deleting {account.name} also deletes its associated transactions.
            </Notice>
            <div className="form-actions">
              <Button onClick={() => setConfirmDelete(false)}>Cancel</Button>
              <Button
                variant="danger"
                disabled={deleting}
                onClick={() => void remove()}
              >
                {deleting ? "Deleting…" : "Delete account"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AccountPage;
