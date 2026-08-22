import axios from "axios";
import { useState, useEffect } from "react";
import "../styles/Accounts.css";
import AccountCard from "./AccountCard";

const Accounts = () => {
    const [accounts, setAccounts] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(0)

    useEffect(() => {
        const getAccounts = async () => {
            const response = await axios.get(
                "http://localhost:5001/api/accounts",
                { 
                    timeout: 5000,
                    params: {
                        page,
                        limit
                    }
                }
            )
            setAccounts(response.data.data);
            setPage(response.data.meta.page);
            setPages(response.data.meta.pages);
            setTotal(response.data.meta.total);
            setLimit(response.data.meta.limit);
        };

        void getAccounts();
    }, [page, limit]);

    console.log("In Accounts component");
    console.log(`Fetched accounts`, accounts);
    console.log(`Current page`, page);
    console.log("Total number of accounts", total);
    console.log("Total number of pages", pages)
    console.log("Limit", limit)

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

