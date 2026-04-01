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
        setTransactions={setTransactions}
        filters={filters}
        setFilters={setFilters}
        role={role}
      />
    </>
  );
}

export default App;
