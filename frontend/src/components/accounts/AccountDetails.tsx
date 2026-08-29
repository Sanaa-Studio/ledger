import type { Account } from "@ledger/contracts";

const AccountDetails = ({ account }: { account: Account }) => {
  return (
    <>
      <div>
        <div>
          <p>{account.name}</p>
          <p>{account.type}</p>
          <p>Balance: {account.openingBalance}</p>
        </div>
        <div>
          <div>
            <p>Transfer</p>
          </div>
          <div>
            <button>+</button>
            <button>-</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountDetails;
