import "./InsightsSection.css";
import { formatCurrency, formatMonthLabel } from "../../utils/formatters";
import { monthlyCategoryTotalsReducer, getHighestExpenseCategoryForMonth, monthlyTotalsReducer } from "../../utils/reducers";
import { useState } from "react";


function InsightsSection({ transactions }) {
  const monthlyCategoryTotals = monthlyCategoryTotalsReducer(transactions);
  const sortedMonths = Object.keys(monthlyCategoryTotals).sort();

  const monthlyTotals = monthlyTotalsReducer(transactions);

  const [selectedMonth, setSelectedMonth] = useState(() => {
    return sortedMonths.length > 0 ? sortedMonths[sortedMonths.length - 1] : null;
  });

  const selectedMonthData = getHighestExpenseCategoryForMonth(monthlyCategoryTotals, selectedMonth);

  return (
    <section className="insights-section">

      {/* highest monthly expense category */}
      <div className="insights-card">
        <div className="insights-card__header">
          <p className="insights-card__eyebrow">Highest spending category</p>
          <select className="insights-card__month-select"
            value={selectedMonth || ""}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {sortedMonths.map((month) => (
              <option key={month} value={month}>
                {formatMonthLabel(month)}
              </option>
            ))}
          </select>
        </div>
        <h3>{selectedMonthData ? selectedMonthData.category : "No expense data"}</h3>
        <p className="insights-card__value">
          {selectedMonthData ? formatCurrency(selectedMonthData.amount) : formatCurrency(0)}
        </p>
      </div>

      {/* savings comparison current vs last month */}
      <div className="insights-card">
        <div className="insights-card__header">
          <p className="insights-card__eyebrow">Monthly savings</p>
        </div>
        <h3>{formatMonthLabel(selectedMonth)}</h3>
        <p className="insights-card__value">
          {monthlyTotals[selectedMonth]
            ? formatCurrency(monthlyTotals[selectedMonth].income - monthlyTotals[selectedMonth].expense)
            : formatCurrency(0)}
        </p>
      </div>
    </section>
  );
}

export default InsightsSection;
