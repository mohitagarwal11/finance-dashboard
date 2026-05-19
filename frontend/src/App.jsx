import { useCallback, useEffect, useState } from "react";

import SummarySection from "./sections/SummarySection";
import TransactionsSection from "./sections/TransactionsSection";
import InsightsSection from "./sections/InsightsSection";
import ChartsSection from "./sections/ChartsSection";
import AuthPage from "./pages/AuthPage";
import SettingsPage from "./pages/SettingsPage";
import DashboardPage from "./pages/DashboardPage";
import { Routes, Route, Link, Navigate } from "react-router-dom";

import { logoutUser } from "./api/auth";
import { setAuthExpiredHandler } from "./api/client";
import {
  clearAuthStorage,
  getStoredUser,
  setAuthTokens,
  setStoredUser,
} from "./api/tokenStore";
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from "./api/transactions";

function App() {
  const [userData, setUserData] = useState(() => getStoredUser());

  const [transactions, setTransactions] = useState([]);

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

  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    type: "all",
  });
  const [expenseLimit, setExpenseLimit] = useState(3000);

  const handleAuthSuccess = (responseData) => {
    const authData = responseData.data;

    setAuthTokens(authData);
    setStoredUser(authData.user);
    setUserData(authData.user);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.log(error);
    } finally {
      clearAuthStorage();
      setUserData(null);
      setTransactions([]);
    }
  };

  const fetchTransactions = useCallback(async (signal) => {
    const response = await getTransactions({ signal });
    setTransactions(response.data.data);
  }, []);

  const handleAddTxn = async (transactionData) => {
    try {
      await createTransaction(transactionData);
      await fetchTransactions();
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const handleEditTxn = async (transactionId, transactionData) => {
    try {
      await updateTransaction(transactionId, transactionData);
      await fetchTransactions();
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const handleDeleteTxn = async (transactionId) => {
    try {
      await deleteTransaction(transactionId);
      await fetchTransactions();
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  useEffect(() => {
    if (!userData) return;

    const controller = new AbortController();

    const load = async () => {
      try {
        await fetchTransactions(controller.signal);
      } catch (error) {
        // axios throws a CanceledError / ERR_CANCELED when aborted
        if (error?.name === "CanceledError" || error?.code === "ERR_CANCELED")
          return;
        console.log(error);
      }
    };

    void load();

    return () => controller.abort();
  }, [fetchTransactions, userData]);

  useEffect(() => {
    const handleExpiredAuth = () => {
      clearAuthStorage();
      setUserData(null);
      setTransactions([]);
    };

    setAuthExpiredHandler(handleExpiredAuth);

    return () => {
      setAuthExpiredHandler(() => {});
    };
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          userData ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <AuthPage onAuthSuccess={handleAuthSuccess} />
          )
        }
      />

      <Route
        path="/dashboard"
        element={
          userData ? (
            <DashboardPage
              userData={userData}
              theme={theme}
              setTheme={setTheme}
              transactions={transactions}
              filters={filters}
              setFilters={setFilters}
              handleAddTxn={handleAddTxn}
              handleEditTxn={handleEditTxn}
              handleDeleteTxn={handleDeleteTxn}
              expenseLimit={expenseLimit}
              setExpenseLimit={setExpenseLimit}
              handleLogout={handleLogout}
            />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      <Route
        path="/settings"
        element={
          userData ? (
            <SettingsPage
              userData={userData}
              setUserData={setUserData}
              expenseLimit={expenseLimit}
              setExpenseLimit={setExpenseLimit}
            />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
