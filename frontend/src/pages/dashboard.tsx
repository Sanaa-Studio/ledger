import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import base62 from "@sindresorhus/base62";
import type { Account, Transaction } from "@ledger/contracts";
import { getAllAccounts, getAllTransactions } from "../api/client";
import { accountBalances, currency, dateLabel } from "../ui/format";
import { ACCOUNT_TYPE_LABELS } from "../ui/config";
import {
  Badge,
  Card,
  EmptyState,
  ErrorMessage,
  LoadingState,
  PageHeader,
} from "../ui/Primitives";

type MonthSummary = { label: string; income: number; spending: number };

const getMonthlySummary = (
  transactions: Transaction[],
  now = new Date(),
): MonthSummary[] => {
  const months = Array.from({ length: 6 }, (_, index) => {
    const monthDate = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5 + index, 1),
    );
    return {
      key: `${monthDate.getUTCFullYear()}-${monthDate.getUTCMonth()}`,
      label: new Intl.DateTimeFormat("en-US", {
        month: "short",
        timeZone: "UTC",
      }).format(monthDate),
      income: 0,
      spending: 0,
    };
  });
  const byMonth = new Map(months.map((month) => [month.key, month]));

  for (const transaction of transactions) {
    if (transaction.destinationAccountId !== null) continue;
    const date = new Date(transaction.date);
    const month = byMonth.get(`${date.getUTCFullYear()}-${date.getUTCMonth()}`);
    if (!month) continue;
    if (transaction.amount >= 0) month.income += transaction.amount;
    else month.spending += Math.abs(transaction.amount);
  }

  return months;
};

const DashboardPage = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [nextAccounts, nextTransactions] = await Promise.all([
        getAllAccounts(),
        getAllTransactions(),
      ]);
      setAccounts(nextAccounts);
      setTransactions(nextTransactions);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Could not load the dashboard.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const request = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(request);
  }, [load]);

  const balances = useMemo(
    () => accountBalances(accounts, transactions),
    [accounts, transactions],
  );
  const totalBalance = [...balances.values()].reduce(
    (sum, value) => sum + value,
    0,
  );
  const monthly = useMemo(
    () => getMonthlySummary(transactions),
    [transactions],
  );
  const maximum = Math.max(
    1,
    ...monthly.flatMap((month) => [month.income, month.spending]),
  );
  const currentMonth = monthly[monthly.length - 1];
  const currentMonthIncome = currentMonth?.income ?? 0;
  const currentMonthSpending = currentMonth?.spending ?? 0;

  if (loading) return <LoadingState label="Loading dashboard" />;
  if (error)
    return <ErrorMessage message={error} onRetry={() => void load()} />;

  return (
    <div className="page-stack">
      <PageHeader
        title="Your overview"
        description="A clear view of your accounts and activity."
      />
      {accounts.length === 0 ? (
        <Card>
          <EmptyState
            title="Start with an account"
            description="Add an account to see balances and transaction activity here."
            action={
              <Link className="button button--primary" to="/accounts">
                Go to accounts
              </Link>
            }
          />
        </Card>
      ) : (
        <>
          <div className="metric-grid">
            <Card className="balance-card">
              <div className="metric-card__label">Total balance</div>
              <strong className="metric-card__value">
                {currency(totalBalance)}
              </strong>
              <span className="metric-card__note">
                Across {accounts.length}{" "}
                {accounts.length === 1 ? "account" : "accounts"}
              </span>
            </Card>
            <Card className="metric-card">
              <div className="metric-card__label">Income this month</div>
              <strong className="metric-card__value">
                {currency(currentMonthIncome)}
              </strong>
              <Badge tone="positive">Incoming</Badge>
            </Card>
            <Card className="metric-card">
              <div className="metric-card__label">Spending this month</div>
              <strong className="metric-card__value">
                {currency(currentMonthSpending)}
              </strong>
              <Badge tone="negative">Outgoing</Badge>
            </Card>
          </div>

          <div className="section-heading">
            <div>
              <h2>Accounts</h2>
              <p className="muted">Your current balances</p>
            </div>
            <Link className="text-link" to="/accounts">
              All accounts <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="account-grid account-grid--overview">
            {accounts.slice(0, 3).map((account) => (
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
                <strong>
                  {currency(balances.get(account.id) ?? account.openingBalance)}
                </strong>
                <span className="account-tile__arrow" aria-hidden="true">
                  ›
                </span>
              </Link>
            ))}
          </div>

          <div className="dashboard-grid">
            <Card className="chart-card">
              <div className="card-heading">
                <div>
                  <h2>Income vs. spending</h2>
                  <p className="muted">Monthly activity, excluding transfers</p>
                </div>
                <div className="chart-legend">
                  <span>
                    <i className="legend-dot legend-dot--income" />
                    Income
                  </span>
                  <span>
                    <i className="legend-dot legend-dot--spending" />
                    Spending
                  </span>
                </div>
              </div>
              <div
                className="chart"
                role="img"
                aria-label="Bar chart of income and spending for the last six months"
              >
                <div className="chart-axis">
                  <span>{currency(maximum)}</span>
                  <span>$0</span>
                </div>
                {monthly.map((month) => (
                  <div className="chart-month" key={month.label}>
                    <div className="chart-month__bars">
                      <span
                        className="chart-bar chart-bar--income"
                        style={{
                          height: `${Math.max(3, (month.income / maximum) * 100)}%`,
                        }}
                        title={`Income ${currency(month.income)}`}
                      />
                      <span
                        className="chart-bar chart-bar--spending"
                        style={{
                          height: `${Math.max(3, (month.spending / maximum) * 100)}%`,
                        }}
                        title={`Spending ${currency(month.spending)}`}
                      />
                    </div>
                    <span className="chart-month__label">{month.label}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="recent-card">
              <div className="card-heading">
                <div>
                  <h2>Recent transactions</h2>
                  <p className="muted">Latest account activity</p>
                </div>
                <Link className="text-link" to="/transactions">
                  View all <span aria-hidden="true">→</span>
                </Link>
              </div>
              {transactions.length === 0 ? (
                <p className="muted table-empty">No transactions yet.</p>
              ) : (
                <div className="recent-list">
                  {transactions.slice(0, 5).map((transaction) => {
                    const source = accounts.find(
                      (account) => account.id === transaction.accountId,
                    );
                    const encodedId = base62.encodeInteger(transaction.id);
                    return (
                      <Link
                        className="recent-row"
                        key={transaction.id}
                        to={`/transactions/${encodedId}`}
                      >
                        <span
                          className={`transaction-mark ${transaction.amount >= 0 ? "transaction-mark--income" : "transaction-mark--expense"}`}
                          aria-hidden="true"
                        >
                          {transaction.amount >= 0 ? "↓" : "↑"}
                        </span>
                        <span className="recent-row__details">
                          <strong>
                            {transaction.description || "Transaction"}
                          </strong>
                          <small>
                            {source?.name ?? "Account"} ·{" "}
                            {dateLabel(transaction.date)}
                          </small>
                        </span>
                        <strong
                          className={
                            transaction.amount >= 0
                              ? "amount-positive"
                              : "amount-negative"
                          }
                        >
                          {currency(transaction.amount)}
                        </strong>
                      </Link>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
