import {
  type Account,
  AccountType,
  AccountTypeSchema,
  type UpdateAccountInput,
  AccountResponseSchema,
} from "@ledger/contracts";
import { useState, type FormEvent } from "react";
import axios from "axios";
import { env } from "../../config/env";

const AccountUpdateForm = ({
  account,
  onCancel,
}: {
  account: Account;
  onCancel: () => void;
}) => {
  const [name, setName] = useState(account.name);
  const [accountType, setAccountType] = useState(account.type);
  const accountTypes = Object.values(AccountType);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updates: UpdateAccountInput = {
      name,
      type: accountType,
    };

    try {
      const response = await axios.patch(
        `${env.accountsUrl}/${account.id}`,
        updates,
      );

      const parsedResponse = AccountResponseSchema.parse(response.data);
      console.log(parsedResponse.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} />

      <select
        name="accountType"
        value={accountType}
        onChange={(e) => {
          try {
            const validatedAccountType = AccountTypeSchema.parse(
              e.target.value,
            );
            setAccountType(validatedAccountType);
          } catch (err) {
            console.error(err);
          }
        }}
      >
        {accountTypes.map((accountType) => (
          <option key={accountType} value={accountType}>
            {accountType}
          </option>
        ))}
      </select>

      <button type="button" onClick={onCancel}>
        Cancel
      </button>

      <button type="submit">Save</button>
    </form>
  );
};

export default AccountUpdateForm;
