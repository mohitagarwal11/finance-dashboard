import "./ChartsSection.css";
import { defaults } from "chart.js/auto";
import { Doughnut, Line } from "react-chartjs-2";
import { formatMonthLabel, formatCurrency } from "../../utils/formatters";
import {
  categoryTotalsReducer,
  monthlyTotalsReducer,
  totalReducer,
} from "../../utils/reducers";

defaults.maintainAspectRatio = false;
defaults.responsive = true;

function ChartsSection({ transactions }) {
  const monthlyTotals = monthlyTotalsReducer(transactions);
  const categoryTotals = categoryTotalsReducer(transactions);
  const summary = totalReducer(transactions);

  const monthLabels = Object.keys(monthlyTotals).map((date) =>
    formatMonthLabel(date).slice(0, 3),
  );
  const monthlyValues = Object.values(monthlyTotals);
  const categoryLabels = Object.keys(categoryTotals);
  const categoryValues = Object.values(categoryTotals);

  const categoryColors = {
    "Food": "#f97316",
    "Transportation": "#3b82f6",
    "Utilities": "#facc15",
    "Rent": "#ef4444",
    "Entertainment": "#a855f7",
    "Investment": "#10b981",
  };

  return (
    <section className="charts-section">
      <div className="charts-section__header">
        <h2>Statistics</h2>
        <p>
          Spending mix and a balance trend based on your transaction timeline.
        </p>
      </div>
      <div className="charts-section__content">
        <div className="charts-section__chart-line">
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
              plugins: {
                tooltip: {
                  callbacks: {
                    label: () => "",
                    title: (context) => `${context[0].dataset.label}`,
                    afterTitle: (context) => {
                      const datasetIndex = context[0].datasetIndex;
                      const monthData = monthlyValues[context[0].dataIndex];
                      const amount =
                        datasetIndex === 0 ? monthData.income : monthData.expense;
                      return `${formatCurrency(amount)}`;
                    }
                  }
                },
                legend: {
                  align: "start",
                  position: "top",
                  labels: {
                    usePointStyle: true,
                    pointStyle: "circle",
                    boxWidth: 7,
                    boxHeight: 7,
                    padding: 16,
                  },
                },
              },
            }}
          />
        </div>
        <div className="charts-section__chart-doughnut">
          <Doughnut
            data={{
              labels: categoryLabels,
              datasets: [
                {
                  data: categoryValues,
                  backgroundColor: categoryLabels.map((label) => categoryColors[label]),
                  borderColor: categoryLabels.map((label) => categoryColors[label]),
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
                    afterTitle: (context) => `Amount: ${formatCurrency(context[0].raw)}`,
                    afterBody: (context) => `${(context[0].raw / summary.totalExpenses * 100).toFixed(1)}% of spendings`,
                  }
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
