import SummaryCard from "../components/SummaryCard/SummaryCard";

function SummarySection({ transactions }) {
  // here totalIncome and totalExpenses are the accumulators 
  // the reducer iterates through all transactions and updates the totalIncome and totalExpenses
  const summary = transactions.reduce((acc, txn) => {
    if (txn.type === "income") {
      acc.totalIncome += txn.amount;
    } else {
      acc.totalExpenses += txn.amount;
    }
    return acc;
  }, { totalIncome: 0, totalExpenses: 0 });
  const netBalance = summary.totalIncome - summary.totalExpenses;

  return (
    <div className="summary-section">
      <SummaryCard title="Total Income" value={summary.totalIncome} type="income" />
      <SummaryCard title="Total Expenses" value={summary.totalExpenses} type="expense" />
      <SummaryCard title="Net Balance" value={netBalance} type="balance" />
    </div>
  );
}

export default SummarySection;
