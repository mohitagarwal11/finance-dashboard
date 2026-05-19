import { useCallback, useEffect, useState } from "react";

import SummarySection from "./sections/SummarySection";
import TransactionsSection from "./sections/TransactionsSection";
import InsightsSection from "./sections/InsightsSection";
import ChartsSection from "./sections/ChartsSection";
import AuthPage from "./pages/AuthPage";

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
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

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

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const themeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = (event) => {
      setTheme(event.matches ? "dark" : "light");
    };

    themeQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      themeQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, []);

  return userData ? (
    <div className="min-h-dvh w-full px-[clamp(15px,3vw,35px)] py-6 pb-9 max-[792px]:px-2 max-[792px]:pt-3 max-[792px]:pb-6">
      <div className="mx-auto flex w-full max-w-356 flex-col gap-3.5 rounded-(--r-xl) border border-(--border-strong) bg-(--shell) p-5 transition-colors duration-180 max-[792px]:gap-3 max-[792px]:rounded-(--r-lg) max-[792px]:p-3.5">
        <header className="flex items-center justify-between gap-4 border-b border-(--border-strong) px-1 pt-2 pb-5 max-[792px]:flex-col max-[792px]:items-start max-[792px]:px-0 max-[792px]:pt-1 max-[792px]:pb-3.75">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-(--r-md) bg-(--accent) text-[13px] font-semibold tracking-[0.02em] text-white">
              MA
            </div>
            <div className="flex flex-col">
              <p className="mt-0 text-[11px] font-medium tracking-[0.07em] text-(--muted)">
                Personal account
              </p>
              <h1 className="text-[30px] font-semibold tracking-normal text-(--text) max-[792px]:text-[25px]">
                Welcome, {userData?.username || "User"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5 max-[792px]:w-full max-[792px]:justify-between">
            <button
              className="cursor-pointer rounded-(--r-md) border border-(--border-strong) bg-(--bg) px-3.5 py-2 text-sm font-semibold text-(--text) hover:border-(--border-focus) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
              type="button"
              onClick={() =>
                setTheme((currentTheme) =>
                  currentTheme === "dark" ? "light" : "dark",
                )
              }
            >
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </button>
            <button
              className="cursor-pointer rounded-(--r-md) border border-(--danger-border) bg-(--danger-light) px-3.5 py-2 text-sm font-semibold text-(--danger-text) hover:border-(--danger-text) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--danger-text)"
              type="button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </header>

        <div className="grid grid-cols-[minmax(0,1fr)_347px] items-stretch gap-3.5 max-[1188px]:grid-cols-1">
          <div className="flex min-w-0 flex-col gap-3.5">
            <SummarySection transactions={transactions} />
            <ChartsSection transactions={transactions} />
          </div>

          <aside className="flex min-w-0 flex-col">
            <InsightsSection
              transactions={transactions}
              expenseLimit={expenseLimit}
            />
          </aside>
        </div>

        <TransactionsSection
          transactions={transactions}
          filters={filters}
          setFilters={setFilters}
          handleAddTxn={handleAddTxn}
          handleDeleteTxn={handleDeleteTxn}
          handleEditTxn={handleEditTxn}
        />
      </div>
    </div>
  ) : (
    <AuthPage onAuthSuccess={handleAuthSuccess} />
  );
}

export default App;
