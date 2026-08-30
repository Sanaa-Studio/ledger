import { env } from "../config/env";
import {
  TransactionsResponseSchema,
  type Transaction,
} from "@ledger/contracts";
import axios from "axios";
import { useEffect, useState } from "react";
import TransactionsDetails from "../components/transactions/TransactionsDetails";
import PageSelector from "../components/PageSelector";
import "../styles/TransactionsPage.css";
import { ZodError } from "zod";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pages, setPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getTransactions = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(env.transactionsUrl, {
          timeout: 5000,
          params: {
            page: page,
            limit: limit,
          },
        });

        const parsedResponse = TransactionsResponseSchema.parse(response.data);

        setTransactions(parsedResponse.data);
        setPages(parsedResponse.meta.pages);
        setPage(parsedResponse.meta.page);
        setLimit(parsedResponse.meta.limit);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(
            error.response?.data?.message ??
              error.message ??
              "Failed to fetch transactions",
          );
        } else if (error instanceof ZodError) {
          console.error(error.issues);
          setError("Received an invalid response from the server");
        } else {
          setError("Unexpected error while loading transactions");
        }
      } finally {
        setLoading(false);
      }
    };

    void getTransactions();
  }, [page, limit]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (transactions.length === 0) {
    return <p> No Transactions </p>;
  }

  return (
    <>
      <div className="transactionsPageContainer">
        <TransactionsDetails transactions={transactions}></TransactionsDetails>
        <PageSelector
          page={page}
          pages={pages}
          setPage={setPage}
        ></PageSelector>
      </div>
    </>
  );
};

export default TransactionsPage;
