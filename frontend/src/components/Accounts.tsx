import axios from "axios";
import { useState, useEffect } from "react";
import "../styles/Accounts.css";
import AccountCard from "./AccountCard";
import { AccountsResponseSchema } from "@ledger/contracts";
import type {Account} from "@ledger/contracts"
import { env } from "../config/env";

const Accounts = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getAccounts = async () => {
            const response = await axios.get(
                env.accountsUrl,
                { 
                    timeout: 5000,
                    params: {
                        page,
                        limit
                    }
                }
            );
            const parsedResponse = AccountsResponseSchema.parse(response.data);
        
            setAccounts(parsedResponse.data);
            setPages(parsedResponse.meta.pages);
            setTotal(parsedResponse.meta.total);
            setLoading(false);
        };

        void getAccounts();
    }, [page, limit]);

    return(
        <>
            <div>
                <ul>
                    {(
                        accounts.map((account) =>
                            <AccountCard 
                                key={account.id}
                                name={account.name}
                                openingBalance={account.openingBalance}
                                type={account.type} 
                            >
                            </AccountCard>
                        )
                    )}
                </ul>
            </div>
        </> 
    )
};

export default Accounts;

