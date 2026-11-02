import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import base62 from "@sindresorhus/base62";
import type {
  Account,
  CreateAccountInput,
  UpdateAccountInput,
} from "@ledger/contracts";
import { createAccount, getAccounts } from "../api/client";
import { PAGE_SIZE } from "../ui/config";
import { ACCOUNT_TYPE_LABELS } from "../ui/config";
import { currency } from "../ui/format";
import {
  Button,
  Card,
  EmptyState,
  ErrorMessage,
  LoadingState,
  Modal,
  PageHeader,
  PageSelector,
} from "../ui/Primitives";
import AccountForm from "../components/forms/AccountForm";

const AccountsPage = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAccounts({ page, limit: PAGE_SIZE });
      setAccounts(response.data);
      setPages(response.meta.pages);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Could not load accounts.",
      );
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    const request = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(request);
  }, [load]);

  const saveAccount = async (
    value: CreateAccountInput | UpdateAccountInput,
  ) => {
    await createAccount(value as CreateAccountInput);
    setShowCreate(false);
    if (page !== 1) setPage(1);
    else await load();
  };

  return (
    <div className="page-stack">
      <PageHeader
        title="Accounts"
        description="Keep track of the places your money lives."
        action={
          <Button variant="primary" onClick={() => setShowCreate(true)}>
            ＋ New account
          </Button>
        }
      />
      {error && <ErrorMessage message={error} onRetry={() => void load()} />}
      {loading ? (
        <LoadingState label="Loading accounts" />
      ) : accounts.length === 0 ? (
        <Card>
          <EmptyState
            title="No accounts yet"
            description="Create your first account to start organizing your finances."
            action={
              <Button variant="primary" onClick={() => setShowCreate(true)}>
                Create account
              </Button>
            }
          />
        </Card>
      ) : (
        <>
          <div className="account-grid">
            {accounts.map((account) => (
              <Link
                className="account-tile"
                key={account.id}
                to={`/accounts/${base62.encodeInteger(account.id)}`}
              >
                <span className="account-tile__icon" aria-hidden="true">
                  {account.type === "creditCard"
                    ? "▭"
                    : account.type === "savings"
                      ? "◉"
                      : "⌂"}
                </span>
                <span className="account-tile__details">
                  <span className="account-tile__name">{account.name}</span>
                  <span className="muted">
                    {ACCOUNT_TYPE_LABELS[account.type]}
                  </span>
                </span>
                <strong>{currency(account.openingBalance)}</strong>
                <span className="account-tile__arrow" aria-hidden="true">
                  ›
                </span>
              </Link>
            ))}
          </div>
          <PageSelector page={page} pages={pages} onPageChange={setPage} />
        </>
      )}
      {showCreate && (
        <Modal
          title="Create account"
          description="Add an account to your Ledger workspace."
          onClose={() => setShowCreate(false)}
        >
          <AccountForm
            onCancel={() => setShowCreate(false)}
            onSave={saveAccount}
          />
        </Modal>
      )}
    </div>
  );
};

export default AccountsPage;
