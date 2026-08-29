import type { Transaction } from "@ledger/contracts";
import TransactionCard from "./TransactionCard";
import "../../styles/Transactions.css";

const TransactionsDetails = ({
  transactions,
}: {
  transactions: Transaction[];
}) => {
  return (
    <>
      <ul className="transactionsContainer">
        {transactions.map((transaction) => (
          <TransactionCard
            key={transaction.id}
            transaction={transaction}
          ></TransactionCard>
        ))}
      </ul>
    </>
  );
};

export default TransactionsDetails;
