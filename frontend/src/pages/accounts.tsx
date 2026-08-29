import AccountsDetails from "../components/accounts/AccountsDetails";
import { AccountsResponseSchema, type Account } from "@ledger/contracts";
import axios from "axios";
import { useState, useEffect } from "react";
import {env} from "../config/env";
import PageSelector from "../components/PageSelector";
import "../styles/AccountsPage.css";
import { ZodError } from "zod";;

const AccountsPage = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(0);
    const [limit, setLimit] = useState(10); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getAccounts = async () => {

            try {
                setLoading(true);
                setError(null);

                const response = await axios.get(
                    env.accountsUrl,
                    {
                        timeout: 5000,
                        params: {
                            page: page,
                            limit: limit
                        }
                    }
                )

                const parsedResponse = AccountsResponseSchema.parse(response.data);

                setAccounts(parsedResponse.data);
                setPage(parsedResponse.meta.page);
                setPages(parsedResponse.meta.pages)
                setLimit(parsedResponse.meta.limit);
            }
            catch (error) {
                if (axios.isAxiosError(error)) {
                    setError(
                        error.response?.data?.message ??
                        error.message ??
                        "Failed to fetch accounts"
                    );
                } 
                else if (error instanceof ZodError) {
                    console.error(error.issues);
                    setError("Received an invalid response from the server");
                }
                else {
                    setError("Unexpected error while loading accounts");
                }
            } finally {
                setLoading(false);
            }
        
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

    if (error) {
        return <p>{error}</p>;
    }


    if (accounts.length === 0){
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
                page={page} pages={pages} setPage={setPage}
                >
                </PageSelector>
            </div>
        </>
    );
};

export default AccountsPage;