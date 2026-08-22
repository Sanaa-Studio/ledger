const AccountCard = ({key, name, openingBalance, type}) => {

    return (
        <>
            <li key={key}>
                {name} <br/>
                {type} <br/>
                {openingBalance} <br/>
            </li>
        </>
    )
};

export default AccountCard;