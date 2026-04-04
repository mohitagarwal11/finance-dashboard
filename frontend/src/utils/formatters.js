// this returns a string with rupee symbol and formatted number with 2 decimal places
export function formatCurrency(value) {
  return `\u20B9${new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)}`;
}

// this returns a string with date formatted as dd mmm yyyy
export function formatTransactionDate(value) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

// this returns a string with date formatted as dd mmm
export function formatShortDate(value) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
  }).format(new Date(value));
}

// this returns a string with date formatted as mmm yyyy
export function formatMonthLabel(monthKey) {
  return new Intl.DateTimeFormat("en-IN", {
    month: "long",
    year: "numeric",
  }).format(new Date(`${monthKey}-01`));
}
