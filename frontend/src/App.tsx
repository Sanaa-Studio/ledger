import { Navigate, Route, Routes } from "react-router-dom";
import Account from "./pages/account";
import Accounts from "./pages/accounts";
import Dashboard from "./pages/dashboard";
import Transactions from "./pages/transactions";
import Transaction from "./pages/transaction";
import Analytics from "./pages/analytics";
import Settings from "./pages/settings";
import Auth from "./pages/auth";
import AppShell from "./ui/AppShell";
import "./App.css";

const App = () => (
  <Routes>
    <Route element={<AppShell />}>
      <Route index element={<Navigate to="/dashboard" replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="accounts" element={<Accounts />} />
      <Route path="accounts/:accountId" element={<Account />} />
      <Route path="transactions" element={<Transactions />} />
      <Route path="transactions/:transactionId" element={<Transaction />} />
      <Route path="analytics" element={<Analytics />} />
      <Route path="settings" element={<Settings />} />
    </Route>
    <Route path="login/*" element={<Auth />} />
  </Routes>
);

export default App;
