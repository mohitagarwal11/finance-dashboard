import { useEffect, useState } from "react";
import { initialTransactions } from "./data/transactions";

import SummarySection from "./sections/SummarySection/SummarySection";
import TransactionsSection from "./sections/TransactionsSection/TransactionsSection";
import InsightsSection from "./sections/InsightsSection/InsightsSection";
import ChartsSection from "./sections/ChartsSection/ChartsSection";

import RoleSwitcher from "./components/RoleSwitcher/RoleSwitcher";

function getInitialTheme() {
  const storedTheme = localStorage.getItem("theme");

  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }
}

function App() {
  // if localstorage has data it parses it otherwise uses mock data from the transactions.js file
  const [transactions, setTransactions] = useState(() => {
    const data = localStorage.getItem("transactions");
    return data ? JSON.parse(data) : initialTransactions;
  });

  const [role, setRole] = useState("user");
  const [theme, setTheme] = useState(getInitialTheme);
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    type: "all",
  });

  const [expenseLimit, setExpenseLimit] = useState(() => {
    const data = localStorage.getItem("expenseLimit");
    return data ? data : 3000;
  });

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
    localStorage.setItem("expenseLimit", expenseLimit);
  }, [transactions, expenseLimit]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  // crud operation handlers
  const handleAddTxn = (newTxn) => {
    setTransactions((prev) => [newTxn, ...prev]);
    console.log("New Transaction Added:", newTxn);
  };

  const handleDeleteTxn = (txnId) => {
    setTransactions((prev) => prev.filter((txn) => txn.id !== txnId));
    console.log("Delete Transaction button clicked for:", txnId);
  };

  const handleEditTxn = (updatedTxn) => {
    setTransactions((prev) =>
      prev.map((txn) => (txn.id == updatedTxn.id ? updatedTxn : txn)),
    );
    console.log("Edit Transaction button clicked for:", updatedTxn.id);
  };

  return (
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
                Good morning, Mohit
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
            <RoleSwitcher role={role} setRole={setRole} />
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
              setExpenseLimit={setExpenseLimit}
              role={role}
            />
          </aside>
        </div>

        <TransactionsSection
          transactions={transactions}
          filters={filters}
          setFilters={setFilters}
          role={role}
          handleAddTxn={handleAddTxn}
          handleDeleteTxn={handleDeleteTxn}
          handleEditTxn={handleEditTxn}
        />
      </div>
    </div>
  );
}

export default App;
