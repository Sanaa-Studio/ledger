import type { Transaction } from "@ledger/contracts";
import TransactionCard from "./TransactionCard";

const TransactionsDetails = (
    {transactions}: 
    {transactions: Transaction []}

) => {
    return (
        <>
            <ul>
                {transactions.map((transaction) => 
                    <TransactionCard
                        key={transaction.id}
                        transaction={transaction}
                    >
                    </TransactionCard>
                )}
            </ul>
        </>
    )
};

export default TransactionsDetails;