import {env} from "../config/env";
import { TransactionsResponseSchema, type Transaction } from "@ledger/contracts";
import axios from "axios";
import { useEffect, useState } from "react";
import TransactionsDetails from "../components/transactions/TransactionsDetails";
import { AccountResponseSchema, type Account } from "@ledger/contracts";

const TransactionsPage = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [pages, setPages] = useState(1);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const getTransactions = async () => {
            const response = await axios.get(
                env.transactionsUrl,
                {
                    timeout: 5000,
                    params: {
                        page: page,
                        limit: limit
                    }
                }
            );

            const parsedResponse = TransactionsResponseSchema.parse(response.data);
            setTransactions(parsedResponse.data);
            setPages(parsedResponse.meta.pages);
            setTotal(parsedResponse.meta.total);
            setLoading(false);
        };

        void getTransactions();
    }, [page, limit]);

    return (
        <>
           <TransactionsDetails 
           transactions={transactions}
           >
           </TransactionsDetails>
        </>
    );
};

export default TransactionsPage;