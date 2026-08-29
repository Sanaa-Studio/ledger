import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import base62 from "@sindresorhus/base62";
import AccountDetails from "../components/accounts/AccountDetails";
import { AccountResponseSchema, type Account } from "@ledger/contracts";
import { env } from "../config/env";
import axios from "axios";

const AccountPage = () => {
  const { accountId: encodedId } = useParams();

  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAccount = async () => {
      if (!encodedId) {
        setLoading(false);
        return;
      }

      const accountId = base62.decodeInteger(encodedId);

      const response = await axios.get(`${env.accountsUrl}/${accountId}`, {
        timeout: 5000,
      });

      const parsedResponse = AccountResponseSchema.parse(response.data);

      setAccount(parsedResponse.data);
      setLoading(false);
    };

    void getAccount();
  }, [encodedId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!account) {
    return <p>Account not found.</p>;
  }

  return (
    <>
      <AccountDetails account={account}></AccountDetails>
    </>
  );
};

export default AccountPage;
