function ChartsSection({ transactions }) {
  // for expenses
  const initialCategories = {
    "Food": 0,
    "Rent": 0,
    "Transportation": 0,
    "Utilities": 0,
    "Entertainment": 0,
  };

  const categoryTotals = transactions.reduce((acc, txn) => {
    if (txn.type !== "expense") return acc;

    acc[txn.category] += txn.amount;

    return acc;
  }, { ...initialCategories });
  // console.log("Category Totals:", categoryTotals);

  const chartData = Object.entries(categoryTotals).map(
    ([category, amount]) => ({ name: category, value: amount })
  );
  // console.log("Chart Data:", chartData);

  return;
}

export default ChartsSection;
