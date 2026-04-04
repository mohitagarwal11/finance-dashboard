import "./App.css";
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
      prev.map((txn) => (txn.id == updatedTxn.id ? updatedTxn : txn))
    );
    console.log("Edit Transaction button clicked for:", updatedTxn.id);
  };

  return (
    <div className="app-shell">
      <div className="app-shell__content">
        <header className="app-header">
          <div className="app-header__intro">
            <div className="app-header__logo">MA</div>
            <div className="app-header__copy">
              <p className="app-header__eyebrow">Personal account</p>
              <h1>Good morning, Mohit</h1>
            </div>
          </div>

          <div className="app-header__actions">
            <button
              className="app-theme-toggle"
              type="button"
              onClick={() =>
                setTheme((currentTheme) =>
                  currentTheme === "dark" ? "light" : "dark"
                )
              }
            >
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </button>
            <RoleSwitcher role={role} setRole={setRole} />
          </div>
        </header>

        <div className="dashboard-layout">
          <div className="dashboard-main">
            <SummarySection transactions={transactions} />
            <ChartsSection transactions={transactions} />
          </div>

          <aside className="dashboard-side">
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
