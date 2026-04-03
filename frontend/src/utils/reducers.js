// this is for calculating the total expenses for each category in the format { "Food": 500, "Rent": 1000 }
export function categoryTotalsReducer(transactions) {
  return transactions.reduce((acc, txn) => {
    if (txn.type !== "expense") return acc;
    acc[txn.category] = (acc[txn.category] || 0) + txn.amount;
    return acc;
  }, {});
}

// this is for calculating total category expenses for each month in the format { "2024-01": { "Food": 200, "Rent": 1000 ...}}
export function monthlyCategoryTotalsReducer(transactions) {
  return transactions.reduce((acc, txn) => {
    if (txn.type !== "expense") return acc;

    const monthKey = txn.date.slice(0, 7);
    if (!acc[monthKey]) {
      acc[monthKey] = {};
    }
    acc[monthKey][txn.category] =
      (acc[monthKey][txn.category] || 0) + txn.amount;

    return acc;
  }, {});
}

// to get the selected months highest expense category and amount in the format { category: "Food", amount: 500 }
export function getHighestExpenseCategoryForMonth(
  monthlyCategoryTotals,
  monthKey,
) {
  const categories = monthlyCategoryTotals[monthKey];

  if (!categories || Object.keys(categories).length === 0) {
    return null;
  }

  return Object.entries(categories).reduce(
    (acc, [category, amount]) =>
      amount > acc.amount ? { category, amount } : acc,
    { category: null, amount: -Infinity },
  );
}

// this gives us the total income and expense for each month in the format { "2024-01": { income: 1000, expense: 500 }}
export function monthlyTotalsReducer(transactions) {
  return transactions.reduce((acc, txn) => {
    const monthKey = txn.date.slice(0, 7);

    if (!acc[monthKey]) {
      acc[monthKey] = {
        income: 0,
        expense: 0,
      };
    }

    if (txn.type === "income") {
      acc[monthKey].income += txn.amount;
    } else {
      acc[monthKey].expense += txn.amount;
    }

    return acc;
  }, {});
}
