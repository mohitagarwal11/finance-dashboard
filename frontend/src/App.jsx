import "./App.css";
import { useEffect, useState } from "react";
import { initialTransactions } from "./data/transactions";

import SummarySection from "./sections/SummarySection";
import ChartsSection from "./sections/ChartsSection";
import TransactionsSection from "./sections/TransactionsSection";
import InsightsSection from "./sections/InsightsSection";

import SummaryCard from "./components/SummaryCard/SummaryCard";
import RoleSwitcher from "./components/RoleSwitcher/RoleSwitcher";
import TransactionItem from "./components/TransactionItem/TransactionItem";

function App() {
  // if localstorage has data it parses it otherwise uses mock data from the transactions.js file
  const [transactions, setTransactions] = useState(() => {
    const data = localStorage.getItem("transactions");
    return data ? JSON.parse(data) : initialTransactions;
  })

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const [role, setRole] = useState("admin");
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    type: "all",
  });

  // crud operation handlers
  const handleAddTxn = (newTxn) => {
    setTransactions((prev) => [newTxn, ...prev]);
    console.log("New Transaction Added:", newTxn);
  }

  const handleDeleteTxn = (txnId) => {
    setTransactions((prev) => prev.filter(txn => txn.id !== txnId));
    console.log("Delete Transaction button clicked for:", txnId);
  }

  const handleEditTxn = (updatedTxn) => {
    setTransactions((prev) => prev.map(txn => txn.id == updatedTxn.id ? updatedTxn : txn));
    console.log("Edit Transaction button clicked for:", updatedTxn.id);
  }

  return (
    <>
      <header>
        <h1>Finance Dashboard</h1>
        <RoleSwitcher role={role} setRole={setRole} />
      </header>

      <SummarySection transactions={transactions} />

      <ChartsSection transactions={transactions} />

      <InsightsSection transactions={transactions} />

      <TransactionsSection
        transactions={transactions}
        filters={filters}
        setFilters={setFilters}
        role={role}
        handleAddTxn={handleAddTxn}
        handleDeleteTxn={handleDeleteTxn}
        handleEditTxn={handleEditTxn}
      />
    </>
  );
}

export default App;
