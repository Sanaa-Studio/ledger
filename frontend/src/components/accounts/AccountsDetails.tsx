import "../../styles/Accounts.css";
import AccountCard from "./AccountCard";
import type {Account} from "@ledger/contracts"

const AccountsDetails = ({accounts}: {accounts: Account[]}) => {
    return(
        <>
            <div>
                <ul className="accountsContainer">
                    {(
                        accounts.map((account) =>
                            <AccountCard
                                key={account.id}
                                account={account}
                            >
                            </AccountCard>
                        )
                    )}
                </ul>
            </div>
        </> 
    )
};

export default AccountsDetails;

