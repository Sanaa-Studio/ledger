import {appEnvSchema} from "@ledger/contracts";

const loadEnv = () => {
    const appEnv = appEnvSchema.parse(import.meta.env.MODE);

    const accountsUrl = import.meta.env.VITE_ACCOUNTS_URL;
    const transactionsUrl = import.meta.env.VITE_TRANSACTIONS_URL;

    return {
        appEnv: appEnv,
        accountsUrl: accountsUrl,
        transactionsUrl: transactionsUrl
    };
};

export const env = loadEnv();
