const AccountCard = (
        { name, openingBalance, type}: 
        { name: string, openingBalance: number, type: string}
    ) => {
    return (
        <>
            <li>
                {name} <br/>
                {type} <br/>
                {openingBalance} <br/>
            </li>
        </>
    )
};

export default AccountCard;