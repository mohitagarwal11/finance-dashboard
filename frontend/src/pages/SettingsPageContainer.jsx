import { useMemo } from "react";

import SettingsPage from "./SettingsPage.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { useTransactions } from "../hooks/useTransactions.js";

const DEFAULT_EXPENSE_LIMIT = 3000;

function getExpenseLimitFromUser(user) {
  const expenseLimit = Number(user?.expenseLimit);
  return Number.isFinite(expenseLimit) ? expenseLimit : DEFAULT_EXPENSE_LIMIT;
}

function SettingsPageContainer() {
  const { user, updateUser, clearSession } = useAuth();
  const { transactions, setTransactions, clearTransactions } =
    useTransactions();

  const expenseLimit = useMemo(() => getExpenseLimitFromUser(user), [user]);

  const handleUserUpdate = (nextUser) => {
    updateUser(nextUser);
  };

  const handleAccountDeleted = async () => {
    clearTransactions();
    await clearSession();
  };

  return (
    <SettingsPage
      userData={user}
      onUserUpdate={handleUserUpdate}
      transactions={transactions}
      setTransactions={setTransactions}
      expenseLimit={expenseLimit}
      onAccountDeleted={handleAccountDeleted}
    />
  );
}

export default SettingsPageContainer;
