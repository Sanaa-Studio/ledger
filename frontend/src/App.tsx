import Home from "./pages/home";
import Accounts from "./pages/accounts";
import Account from "./pages/account";
import Analytics from "./pages/analytics";
import Dashboard from "./pages/dashboard";
import Settings from "./pages/settings";
import Transactions from "./pages/transactions";
import Transaction from "./pages/transaction";
import Auth from "./pages/auth";

import { Routes, Route } from "react-router-dom";

const App = () => {
  console.log(`In app page`);
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="analytics" element={<Analytics />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="settings" element={<Settings />} />
      <Route path="transactions" element={<Transactions />} />
      <Route path="transactions/:transactionId" element={<Transaction />} />
      <Route path="accounts" element={<Accounts />} />
      <Route path="accounts/:accountId" element={<Account />} />
      <Route path="login/*" element={<Auth />} />
    </Routes>
  );
};

export default App;
