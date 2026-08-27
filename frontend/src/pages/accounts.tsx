import AccountsDetails from "../components/accounts/AccountsDetails";
import { AccountsResponseSchema, type Account } from "@ledger/contracts";
import axios from "axios";
import { useState, useEffect } from "react";
import {env} from "../config/env";
import PageSelector from "../components/PageSelector";
import "../styles/AccountsPage.css"

const AccountsPage = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(0);
    const [total, setTotal] = useState(0);
    const [limit, setLimit] = useState(10); 
    const [loading, setLoading] = useState(true);

    const url = "accounts";

    useEffect(() => {
        const getAccounts = async () => {
            const response = await axios.get(
                env.accountsUrl,
                {
                    timeout: 5000,
                    params: {
                        page: page,
                        limit: limit
                    }
                }
            );
            const parsedResponse = AccountsResponseSchema.parse(response.data);

            setAccounts(parsedResponse.data);
            setPage(parsedResponse.meta.page);
            setTotal(parsedResponse.meta.total);
            setLoading(false);
        };
        void getAccounts();
    }, [page, limit]);

    // Below AccountsDetails I will also add a component for switching to
    // Next page where I will pass page, limit, pages and total as props

    if (loading){
        return (
            <p>Loading...</p>
        );
    };

    if (!accounts){
        return (
            <p> No Accounts </p>
        );
    };

    return (
        <>
            <div className="accountsPageContainer">
                <AccountsDetails 
                    accounts={accounts}
                    >
                </AccountsDetails>
                <PageSelector
                page={page} url={url} pages={pages} limit={limit}
                >
                </PageSelector>
            </div>
        </>
    );
};

export default AccountsPage;