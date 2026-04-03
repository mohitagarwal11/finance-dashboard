import "./InsightsSection.css";
import { formatCurrency, formatMonthLabel } from "../../utils/formatters";
import { monthlyCategoryTotalsReducer, getHighestExpenseCategoryForMonth, monthlyTotalsReducer } from "../../utils/reducers";
import { useState } from "react";


function InsightsSection({ transactions, expenseLimit, setExpenseLimit, role }) {
  const monthlyCategoryTotals = monthlyCategoryTotalsReducer(transactions);
  const sortedMonths = Object.keys(monthlyCategoryTotals).sort();

  const monthlyTotals = monthlyTotalsReducer(transactions);

  const [selectedMonth, setSelectedMonth] = useState(() => {
    return sortedMonths.length > 0 ? sortedMonths[sortedMonths.length - 1] : null;
  });

  // const currentMonth = new Date().toISOString().slice(0, 7);
  const selectedMonthData = getHighestExpenseCategoryForMonth(monthlyCategoryTotals, selectedMonth);

  const percentOver = ((monthlyTotals[selectedMonth].expense - expenseLimit) / expenseLimit * 100).toFixed(1);
  const percentUnder = ((expenseLimit - monthlyTotals[selectedMonth].expense) / expenseLimit * 100).toFixed(1);

  return (
    <section className="insights-section">

      {/* monthly expense limit tracker */}
      <div className="insights-card">
        <div className="insights-card__header">
          <p className="insights-card__eyebrow">Monthly expense tracker</p>

          {role === "admin" && (
            <input
              className="transactions-section__input"
              type="number"
              value={expenseLimit ?? ""}
              inputMode="decimal"
              onChange={(e) => {
                const val = e.target.value;
                if (val === "") {
                  setExpenseLimit("");
                  return;
                }
                setExpenseLimit(parseFloat(val));
              }}
            />
          )}

          {role !== "admin" && (
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
          )}
        </div>
        <p className="insights-card__value">
          {formatCurrency(monthlyTotals[selectedMonth] ? monthlyTotals[selectedMonth].expense : 0)}
        </p>
        <p className="insights-card__caption">
          {monthlyTotals[selectedMonth] && monthlyTotals[selectedMonth].expense > expenseLimit
            ? `${percentOver}% over your monthly budget of ${formatCurrency(expenseLimit)}.`
            : `${percentUnder}% remaining off ${formatCurrency(expenseLimit)}.`}
        </p>
      </div>

      {/* highest monthly expense category */}
      <div className="insights-card">
        <div className="insights-card__header">
          <p className="insights-card__eyebrow">Highest spending category</p>
        </div>
        <h3>{selectedMonthData ? selectedMonthData.category : "No expense data"}</h3>
        <p className="insights-card__value">
          {selectedMonthData ? formatCurrency(selectedMonthData.amount) : formatCurrency(0)}
        </p>
        <p className="insights-card__caption">
          {selectedMonthData && monthlyTotals[selectedMonth] ?
            `This accounts for ${((selectedMonthData.amount / monthlyTotals[selectedMonth].expense) * 100).toFixed(1)}% of your spendings this month.`
            : "No expenses recorded for this month."}
        </p>
      </div>

      {/* savings comparison current vs last month */}
      <div className="insights-card">
        <div className="insights-card__header">
          <p className="insights-card__eyebrow">Monthly net savings</p>
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
