import type {Transaction, Account} from "@ledger/contracts";
import { AccountResponseSchema } from "@ledger/contracts";
import { Link } from "react-router-dom";
import base62 from "@sindresorhus/base62";
import {env} from "../../config/env";
import axios from "axios";
import { useState, useEffect } from "react";
import "../../styles/TransactionCard.css"

const TransactionCard = (
    {transaction}: 
    {transaction: Transaction}
) => {
    const [srcAccount, setSrcAccount] = useState<Account>();
    const [destAccount, setDestAccount] = useState<Account | undefined>(undefined);

    const encodedId = base62.encodeInteger(transaction.id);
    const destinationUrl = `/transactions/${encodedId}`;

    useEffect(() => {
        const getAccount = async (accountId: number, updateState: typeof setSrcAccount | typeof setDestAccount) => {
            const url = `${env.accountsUrl}/${accountId}`;
            const response = await axios.get(
                url,
                {timeout: 5000}
            );

            const parsedResponse = AccountResponseSchema.parse(response.data);
            updateState(parsedResponse.data);
        };

        void getAccount(transaction.accountId, setSrcAccount);

        if (transaction.destinationAccountId !== null){
            void getAccount(transaction.destinationAccountId, setDestAccount);
        };

    }, [transaction.accountId, transaction.destinationAccountId]);

    console.log("In transactions card page");

    let destContent;

    if (destAccount != null) {
        destContent = `To ${destAccount.name}`;
    }

    return (
        <>
            <li className="transactionCardContainer">
                <Link 
                to={destinationUrl}
                state={[srcAccount?.name, destAccount?.name]}>
                    <p> From </p>
                    <p>{srcAccount?.name}</p>

                    { destAccount && destContent}

                    <p>{transaction.amount}</p>
                    <p>{transaction.description}</p>
                </Link>
            </li>
        </>
    );
};

export default TransactionCard;