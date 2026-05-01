import { formatCurrency, formatMonthLabel } from "../../utils/formatters";
import {
  monthlyCategoryTotalsReducer,
  getHighestExpenseCategoryForMonth,
  monthlyTotalsReducer,
} from "../../utils/reducers";
import { useState } from "react";

const compactFieldClass =
  "w-full rounded-(--r-sm) border border-(--border-strong) bg-(--surface) px-2 py-1 text-xs text-(--text) hover:border-(--border-focus)";
const cardClass =
  "flex flex-1 min-w-0 flex-col justify-center rounded-(--r-lg) border border-(--border) bg-(--surface) p-3.5";
const cardHeaderClass =
  "flex min-w-0 flex-wrap items-center justify-between gap-[9px]";
const headerControlClass = "flex w-[124px] shrink-0 justify-end";
const toolbarClass =
  "flex min-w-0 items-center justify-between gap-3 rounded-(--r-lg) border border-(--border) bg-(--surface) px-3.5 py-2.5";
const eyebrowClass =
  "mb-1 mt-0 text-[11px] font-medium tracking-[0.07em] text-(--muted)";
const headingClass = "m-0 text-xl font-semibold tracking-normal text-(--text)";
const valueClass =
  "mt-1.5 mb-0 text-2xl font-medium tracking-normal text-(--text)";
const captionClass =
  "mt-1 mb-0 text-xs text-(--muted) [overflow-wrap:anywhere]";

function InsightsSection({
  transactions,
  expenseLimit,
  setExpenseLimit,
  role,
}) {
  const monthlyCategoryTotals = monthlyCategoryTotalsReducer(transactions);
  const sortedMonths = Object.keys(monthlyCategoryTotals).sort();

  const monthlyTotals = monthlyTotalsReducer(transactions);

  const [selectedMonth, setSelectedMonth] = useState(() => {
    return sortedMonths.length > 0
      ? sortedMonths[sortedMonths.length - 1]
      : null;
  });

  // const currentMonth = new Date().toISOString().slice(0, 7);
  const selectedMonthData = getHighestExpenseCategoryForMonth(
    monthlyCategoryTotals,
    selectedMonth,
  );

  const percentOver = (
    ((monthlyTotals[selectedMonth].expense - expenseLimit) / expenseLimit) *
    100
  ).toFixed(1);
  // const percentUnder = (
  //   ((expenseLimit - monthlyTotals[selectedMonth].expense) / expenseLimit) *
  //   100
  // ).toFixed(1);

  return (
    <section className="flex h-full w-full min-w-0 flex-col gap-3">
      <div className={toolbarClass}>
        <div className="min-w-0">
          <p className={eyebrowClass}>Insights</p>
          <h2 className={headingClass}>
            {role === "admin" ? "Expense limit" : "Monthly view"}
          </h2>
        </div>

        <div className={headerControlClass}>
          {role === "admin" ? (
            <input
              className={compactFieldClass}
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
          ) : (
            <select
              className={compactFieldClass}
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
      </div>

      {/* monthly expense limit tracker */}
      <div className={cardClass}>
        <div className={cardHeaderClass}>
          <p className={eyebrowClass}>Monthly expense tracker</p>
        </div>
        <h3 className={headingClass}>Total Expense</h3>
        <p className={valueClass}>
          {formatCurrency(
            monthlyTotals[selectedMonth]
              ? monthlyTotals[selectedMonth].expense
              : 0,
          )}
        </p>
        <p className={captionClass}>
          {monthlyTotals[selectedMonth] &&
          monthlyTotals[selectedMonth].expense > expenseLimit
            ? `${percentOver}% over budget.`
            : `Under budget, ${formatCurrency(expenseLimit - monthlyTotals[selectedMonth].expense)} still left.`}
        </p>
      </div>

      {/* highest monthly expense category */}
      <div className={cardClass}>
        <div className={cardHeaderClass}>
          <p className={eyebrowClass}>Highest spending category</p>
        </div>
        <h3 className={headingClass}>
          {selectedMonthData ? selectedMonthData.category : "No expense data"}
        </h3>
        <p className={valueClass}>
          {selectedMonthData
            ? formatCurrency(selectedMonthData.amount)
            : formatCurrency(0)}
        </p>
        <p className={captionClass}>
          {selectedMonthData && monthlyTotals[selectedMonth]
            ? `${((selectedMonthData.amount / monthlyTotals[selectedMonth].expense) * 100).toFixed(1)}% of your expense.`
            : "No expenses recorded for this month."}
        </p>
      </div>

      {/* savings comparison current vs last month */}
      <div className={cardClass}>
        <div className={cardHeaderClass}>
          <p className={eyebrowClass}>Monthly net savings</p>
        </div>
        <h3 className={headingClass}>{formatMonthLabel(selectedMonth)}</h3>
        <p className={valueClass}>
          {monthlyTotals[selectedMonth]
            ? formatCurrency(
                monthlyTotals[selectedMonth].income -
                  monthlyTotals[selectedMonth].expense,
              )
            : formatCurrency(0)}
        </p>
        <p className={captionClass}>
          {selectedMonthData && monthlyTotals[selectedMonth]
            ? `${
                monthlyTotals[selectedMonth].income >=
                monthlyTotals[selectedMonth].expense
                  ? "You came out ahead this month."
                  : "Your expenses outran your income this month."
              }`
            : "No expenses recorded for this month."}
        </p>
      </div>
    </section>
  );
}

export default InsightsSection;
