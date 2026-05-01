import SummaryCard from "../../components/SummaryCard/SummaryCard";
import { totalReducer } from "../../utils/reducers";
function SummarySection({ transactions }) {
  // here totalIncome and totalExpenses are the accumulators 
  // the reducer iterates through all transactions and updates the totalIncome and totalExpenses
  const summary = totalReducer(transactions);
  const netBalance = summary.totalIncome - summary.totalExpenses;

  return (
    <section className="grid w-full min-w-0 grid-cols-3 gap-3.5 max-[1078px]:grid-cols-2 max-[704px]:grid-cols-1">
      <SummaryCard title="Net Balance" value={netBalance} type="balance" />
      <SummaryCard title="Total Income" value={summary.totalIncome} type="income" />
      <SummaryCard title="Total Expenses" value={summary.totalExpenses} type="expense" />
    </section>
  );
}

export default SummarySection;
