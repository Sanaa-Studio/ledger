import { useParams, useLocation } from "react-router-dom";
import base62 from "@sindresorhus/base62";
import { TransactionResponseSchema, type Transaction } from "@ledger/contracts";
import { useState, useEffect } from "react";
import { env } from "../config/env";
import axios from "axios";
import TransactionDetail from "../components/transactions/TransactionDetail";
import * as z from "zod";

const TransactionPage = () => {
    console.log("In transaction page");
    const [transaction, setTransaction] = useState<Transaction>();

    const {transactionId} = useParams();

    const location = useLocation();
    const [srcAccount, destAccount] = location.state;

    const srcAccountSchema = z.string();
    const destAccountSchema = z.string().optional();
    const transactionIdSchema = z.string();

    const parsedSrcAccount = srcAccountSchema.parse(srcAccount);
    const parsedDestAccount = destAccountSchema.parse(destAccount);
    const parsedTransactionId = transactionIdSchema.parse(transactionId);

    const decodedId = base62.decodeInteger(parsedTransactionId);
    const url = `${env.transactionsUrl}/${decodedId}`;

    useEffect(() => {
        const getTransaction = async() => {
            const response = await axios.get(
                url,
                {timeout: 5000}
            );

            const parsedResponse = TransactionResponseSchema.parse(response.data);
            setTransaction(parsedResponse.data);
        };

        void getTransaction();
    }, [url]);

    if (!transaction) {
        return (<p>Transaction Unavailable</p>)
    }

    return (
        <>
            <TransactionDetail 
              transaction={transaction}
              srcAccount={parsedSrcAccount}
              destAccount={parsedDestAccount}
            >
            </TransactionDetail>
        </>
    );
};

export default TransactionPage;