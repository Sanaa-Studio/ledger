import { useParams } from "react-router-dom";

const AccountPage = () => {
    const params = useParams();
    const accountId = params.accountId;
    console.log("In account page");
    console.log(`params: ${params}`);

    return (
        <>
            <div>
                <p>
                    Account Page, account id: {accountId}
                </p>
            </div>
        </>
    );
};

export default AccountPage;