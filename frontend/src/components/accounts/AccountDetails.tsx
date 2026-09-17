import type { Account } from "@ledger/contracts";
import AccountUpdateForm from "./AccountUpdateForm";
import AccountInfo from "./AccountInfo";
import { useState } from "react";

const AccountDetails = ({ account }: { account: Account }) => {
  const [editing, setEditing] = useState(false);

  return (
    <>
      {editing ? (
        <AccountUpdateForm
          account={account}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <AccountInfo account={account} onEdit={() => setEditing(true)} />
      )}

      <div>
        <p>Transfer</p>
        <button>+</button>
        <button>-</button>
      </div>
    </>
  );
};

export default AccountDetails;
