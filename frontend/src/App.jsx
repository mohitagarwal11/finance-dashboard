import "./App.css";
import { useState } from "react";
import { initialTransactions } from "./data/transactions";

import SummarySection from "./sections/SummarySection";
import ChartsSection from "./sections/ChartsSection";
import TransactionsSection from "./sections/TransactionsSection";
import InsightsSection from "./sections/InsightsSection";

import SummaryCard from "./components/SummaryCard";
import RoleSwitcher from "./components/RoleSwitcher";
import TransactionItem from "./components/TransactionItem";

function App() {
  const [transactions, setTransactions] = useState(initialTransactions);
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
