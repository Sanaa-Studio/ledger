import { useParams } from "react-router-dom";

const TransactionPage = () => {
    const params = useParams();
    const transactionId = params.accountId;
    console.log("In account page");
    console.log(`params: ${params}`);

    return (
        <>
            <div>
                <p>
                    Transaction Page, transaction id: {transactionId}
                </p>
            </div>
        </>
    );
};

export default TransactionPage;