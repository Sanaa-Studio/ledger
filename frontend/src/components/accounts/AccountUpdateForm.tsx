import { type Account, AccountType } from "@ledger/contracts";

const AccountUpdateForm = ({
  account,
  onCancel,
}: {
  account: Account;
  onCancel: () => void;
}) => {
  const accountTypes = Object.values(AccountType);
  return (
    <form>
      <input defaultValue={account.name} />

      <select name="accountType" defaultValue={account.type}>
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
