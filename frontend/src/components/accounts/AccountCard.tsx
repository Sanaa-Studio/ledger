import "../../styles/AccountCard.css";
import { Link } from "react-router";
import base62 from '@sindresorhus/base62';
import type { Account } from "@ledger/contracts"

const AccountCard = ({ account }: { account: Account}) => {
    const encodedId = base62.encodeInteger(account.id);
    const accountDetailUrl = `/accounts/${encodedId}`;

    return (
        <>

            <li className="accountCardContainer">
                <Link to={accountDetailUrl}>
                    {account.name} <br/>
                    {account.type} <br/>
                    {account.openingBalance} <br/>
                </Link>
            </li>
            
        </>
    )
};

export default AccountCard;