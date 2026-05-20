import { useEffect, useMemo, useState } from "react";

import DashboardPage from "./DashboardPage.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { useTransactions } from "../hooks/useTransactions.js";

const DEFAULT_EXPENSE_LIMIT = 3000;

function getExpenseLimitFromUser(user) {
  const expenseLimit = Number(user?.expenseLimit);
  return Number.isFinite(expenseLimit) ? expenseLimit : DEFAULT_EXPENSE_LIMIT;
}

function DashboardPageContainer() {
  const { user, logout } = useAuth();
  const { transactions, addTransaction, editTransaction, removeTransaction } =
    useTransactions();
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    type: "all",
  });
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || stored === "light") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    try {
      document.documentElement.dataset.theme = theme;
      localStorage.setItem("theme", theme);
    } catch {
      // ignore in non-browser environments
    }
  }, [theme]);

  const expenseLimit = useMemo(() => getExpenseLimitFromUser(user), [user]);

  return (
    <DashboardPage
      userData={user}
      theme={theme}
      setTheme={setTheme}
      transactions={transactions}
      filters={filters}
      setFilters={setFilters}
      handleAddTxn={addTransaction}
      handleEditTxn={editTransaction}
      handleDeleteTxn={removeTransaction}
      expenseLimit={expenseLimit}
      handleLogout={logout}
    />
  );
}

export default DashboardPageContainer;
