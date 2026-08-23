import type {Transaction} from "@ledger/contracts";
import { Link } from "react-router-dom";
import base62 from "@sindresorhus/base62";

const DestinationAccount = (
    {destinationUrl, destAccountName}:
    {destinationUrl: string | undefined, destAccountName: string | undefined}
) => {
    console.log("[TRANSACTION DETAIL]: Inside rendering of destination account info");
    console.log("[TRANSACTION DETAIL]: destination account url", destinationUrl);
    console.log("[TRANSACTION DETAIL]: destination account name", destAccountName);
    if (destinationUrl == null) {
        return null;
    }

    return(
        <Link to={destinationUrl}>
            <p>To: {destAccountName}</p>
        </Link>
    );
};

const TransactionDetail = (
    {transaction, srcAccount, destAccount} :
    {transaction: Transaction, srcAccount: string, destAccount: string | undefined}
) => {
    console.log("In transaction detail component");

    const srcAccountId = transaction.accountId;
    const encodedSrcAccountId = base62.encodeInteger(srcAccountId);
    const srcAccountUrl = `/accounts/${encodedSrcAccountId}`;
    console.log("source account url", srcAccountUrl);

    const destAccountId = transaction?.destinationAccountId;

    let destAccountUrl;

    if (destAccountId != null) {
        const encodedDestAccountId = base62.encodeInteger(destAccountId);
        destAccountUrl = `/accounts/${encodedDestAccountId}`;
        console.log("destAccountUrl", destAccountUrl);
    }

    return (
        <>
            <p>{transaction.amount}</p>
            <p> {String(transaction.date)}</p>
            <p> {transaction.description}</p>
            <Link to={srcAccountUrl}>
                <p>From: {srcAccount}</p>
            </Link>
            < DestinationAccount
                destinationUrl={destAccountUrl}
                destAccountName={destAccount}
            >  
            </DestinationAccount>
        </>
    )
};

export default TransactionDetail;