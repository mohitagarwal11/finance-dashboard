import { defaults } from "chart.js/auto";
import { Doughnut, Line } from "react-chartjs-2";
import { formatMonthLabel, formatCurrency } from "../utils/formatters";
import {
  categoryTotalsReducer,
  monthlyTotalsReducer,
  totalReducer,
} from "../utils/reducers";

defaults.maintainAspectRatio = false;
defaults.responsive = true;

function ChartsSection({ transactions }) {
  const monthlyTotals = monthlyTotalsReducer(transactions);
  const categoryTotals = categoryTotalsReducer(transactions);
  const summary = totalReducer(transactions);

  const monthlyEntries = Object.entries(monthlyTotals).sort(([a], [b]) =>
    a.localeCompare(b),
  );
  const monthLabels = monthlyEntries.map(([date]) =>
    formatMonthLabel(date).slice(0, 3),
  );
  const monthlyValues = monthlyEntries.map(([, totals]) => totals);
  const categoryLabels = Object.keys(categoryTotals);
  const categoryValues = Object.values(categoryTotals);

  const categoryColors = {
    Food: "#f97316",
    Transportation: "#3b82f6",
    Utilities: "#facc15",
    Rent: "#ef4444",
    Entertainment: "#a855f7",
    Investment: "#10b981",
  };

  return (
    <section className="flex min-w-0 flex-col gap-4 rounded-(--r-lg) border border-(--border) bg-(--surface) p-5 max-[704px]:p-4">
      <div className="flex items-start justify-between gap-4 max-[704px]:flex-col max-[704px]:gap-2">
        <h2 className="mb-0 text-xl font-semibold tracking-normal text-(--text)">
          Statistics
        </h2>
        <p className="m-0 max-w-70 text-right text-[11px] text-(--muted) max-[704px]:max-w-none max-[704px]:text-left">
          Spending mix and a balance trend based on your transaction timeline.
        </p>
      </div>
      <div className="grid min-w-0 grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] items-stretch gap-3.5 max-[990px]:grid-cols-1">
        <div className="min-h-80 min-w-0 rounded-(--r-md) border border-(--border) bg-(--surface) p-4 [&_canvas]:max-w-full">
          <Line
            data={{
              labels: monthLabels,
              datasets: [
                {
                  label: "Income",
                  data: monthlyValues.map((data) => data.income),
                  borderColor: "green",
                  backgroundColor: "green",
                  tension: 0.35,
                },
                {
                  label: "Expense",
                  data: monthlyValues.map((data) => data.expense),
                  borderColor: "red",
                  backgroundColor: "red",
                  tension: 0.35,
                },
              ],
            }}
            options={{
              interaction: {
                mode: "index",
                intersect: false,
              },
              plugins: {
                tooltip: {
                  callbacks: {
                    title: (context) => monthLabels[context[0].dataIndex],
                    label: (context) =>
                      `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`,
                  },
                },
                legend: {
                  align: "center",
                  position: "bottom",
                  labels: {
                    usePointStyle: true,
                    pointStyle: "circle",
                    boxWidth: 7,
                    boxHeight: 7,
                    padding: 14,
                  },
                },
              },
            }}
          />
        </div>
        <div className="min-h-80 min-w-0 rounded-(--r-md) border border-(--border) bg-(--surface) p-4 [&_canvas]:max-w-full">
          <Doughnut
            data={{
              labels: categoryLabels,
              datasets: [
                {
                  data: categoryValues,
                  backgroundColor: categoryLabels.map(
                    (label) => categoryColors[label],
                  ),
                  borderColor: categoryLabels.map(
                    (label) => categoryColors[label],
                  ),
                  radius: "75%",
                  cutout: "60%",
                },
              ],
            }}
            options={{
              plugins: {
                tooltip: {
                  callbacks: {
                    label: () => "",
                    afterTitle: (context) =>
                      `Amount: ${formatCurrency(context[0].raw)}`,
                    afterBody: (context) =>
                      `${((context[0].raw / summary.totalExpenses) * 100).toFixed(1)}% of spendings`,
                  },
                },
                legend: {
                  align: "center",
                  position: "bottom",
                  labels: {
                    usePointStyle: true,
                    pointStyle: "circle",
                    boxWidth: 7,
                    boxHeight: 7,
                    padding: 14,
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </section>
  );
}

export default ChartsSection;
