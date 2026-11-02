import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import base62 from "@sindresorhus/base62";
import type {
  Account,
  CreateTransactionInput,
  Transaction,
  UpdateTransactionInput,
} from "@ledger/contracts";
import {
  createTransaction,
  getAllAccounts,
  getTransactions,
} from "../api/client";
import { PAGE_SIZE } from "../ui/config";
import { currency, dateLabel } from "../ui/format";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorMessage,
  LoadingState,
  Modal,
  PageHeader,
  PageSelector,
} from "../ui/Primitives";
import TransactionForm from "../components/forms/TransactionForm";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
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
      const [transactionResult, accountResult] = await Promise.all([
        getTransactions({ page, limit: PAGE_SIZE }),
        getAllAccounts(),
      ]);
      setTransactions(transactionResult.data);
      setPages(transactionResult.meta.pages);
      setAccounts(accountResult);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Could not load transactions.",
      );
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    const request = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(request);
  }, [load]);

  const saveTransaction = async (
    value: CreateTransactionInput | UpdateTransactionInput,
  ) => {
    await createTransaction(value as CreateTransactionInput);
    setShowCreate(false);
    if (page !== 1) setPage(1);
    else await load();
  };

  return (
    <div className="page-stack">
      <PageHeader
        title="Transactions"
        description="A record of income, spending, and transfers."
        action={
          <Button variant="primary" onClick={() => setShowCreate(true)}>
            ＋ Add transaction
          </Button>
        }
      />
      {error && <ErrorMessage message={error} onRetry={() => void load()} />}
      {loading ? (
        <LoadingState label="Loading transactions" />
      ) : transactions.length === 0 ? (
        <Card>
          <EmptyState
            title="No transactions yet"
            description={
              accounts.length
                ? "Add your first transaction to start building your activity history."
                : "Create an account before adding a transaction."
            }
            action={
              accounts.length ? (
                <Button variant="primary" onClick={() => setShowCreate(true)}>
                  Add transaction
                </Button>
              ) : (
                <Link className="button button--primary" to="/accounts">
                  Create account
                </Link>
              )
            }
          />
        </Card>
      ) : (
        <>
          <Card className="table-card">
            <div className="table-toolbar">
              <div>
                <h2>All activity</h2>
                <p className="muted">Page {page} · newest first</p>
              </div>
              <span className="table-count">{transactions.length} shown</span>
            </div>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th scope="col">Description</th>
                    <th scope="col">Type</th>
                    <th scope="col">Date</th>
                    <th scope="col">Account</th>
                    <th scope="col" className="numeric">
                      Amount
                    </th>
                    <th>
                      <span className="sr-only">Open</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => {
                    const source = accounts.find(
                      (account) => account.id === transaction.accountId,
                    );
                    const destination = accounts.find(
                      (account) =>
                        account.id === transaction.destinationAccountId,
                    );
                    const isTransfer =
                      transaction.destinationAccountId !== null;
                    const label = isTransfer
                      ? "Transfer"
                      : transaction.amount >= 0
                        ? "Income"
                        : "Expense";
                    return (
                      <tr key={transaction.id}>
                        <td>
                          <Link
                            className="table-primary-link"
                            to={`/transactions/${base62.encodeInteger(transaction.id)}`}
                          >
                            {transaction.description || "Transaction"}
                          </Link>
                        </td>
                        <td>
                          <Badge
                            tone={
                              isTransfer
                                ? "neutral"
                                : transaction.amount >= 0
                                  ? "positive"
                                  : "negative"
                            }
                          >
                            {label}
                          </Badge>
                        </td>
                        <td>{dateLabel(transaction.date)}</td>
                        <td>
                          {source?.name ?? "Unknown account"}
                          {destination ? (
                            <span className="muted"> → {destination.name}</span>
                          ) : null}
                        </td>
                        <td
                          className={`numeric ${transaction.amount >= 0 ? "amount-positive" : "amount-negative"}`}
                        >
                          {currency(transaction.amount)}
                        </td>
                        <td>
                          <Link
                            className="row-arrow"
                            aria-label={`View ${transaction.description || "transaction"}`}
                            to={`/transactions/${base62.encodeInteger(transaction.id)}`}
                          >
                            →
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
          <PageSelector page={page} pages={pages} onPageChange={setPage} />
        </>
      )}
      {showCreate && (
        <Modal
          title="Add transaction"
          description="Record income, spending, or a transfer between accounts."
          onClose={() => setShowCreate(false)}
          wide
        >
          <TransactionForm
            accounts={accounts}
            onCancel={() => setShowCreate(false)}
            onSave={saveTransaction}
          />
        </Modal>
      )}
    </div>
  );
};

export default TransactionsPage;
