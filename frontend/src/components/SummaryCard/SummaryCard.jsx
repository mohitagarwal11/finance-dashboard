import { formatCurrency } from "../../utils/formatters";

function SummaryCard({ title, value, type = "balance" }) {
  const valueColor =
    type === "income"
      ? "text-(--green-strong)"
      : type === "expense"
        ? "text-(--danger-text)"
        : "text-(--text)";

  return (
    <div className="flex min-h-26 min-w-0 flex-col justify-between rounded-(--r-lg) border border-(--border) bg-(--surface) p-5 max-[704px]:min-h-24 max-[704px]:p-4">
      <span className="text-[11px] font-medium tracking-[0.06em] text-(--text-secondary)">
        {title}
      </span>
      <p className={`mt-3 text-2xl font-medium tracking-normal ${valueColor}`}>
        {formatCurrency(value)}
      </p>
    </div>
  );
}

export default SummaryCard;
