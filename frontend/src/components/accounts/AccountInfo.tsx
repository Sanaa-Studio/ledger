import { type Account } from "@ledger/contracts";

const AccountInfo = ({
  account,
  onEdit,
}: {
  account: Account;
  onEdit: () => void;
}) => {
  return (
    <>
      <div>
        <p> {account.name} </p>
        <p> {account.type} </p>
        <p> Balance: {account.openingBalance} </p>

        <button type="button" onClick={onEdit}>
          Edit
        </button>
      </div>
    </>
  );
};

export default AccountInfo;
