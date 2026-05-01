import { formatCurrency, formatTransactionDate } from "../../utils/formatters";

function TransactionItem({ transaction, role, onEdit, onDelete }) {
  const { title, amount, type, category, date } = transaction;
  const amountColor =
    type === "income" ? "text-(--green-strong)" : "text-(--danger-text)";

  return (
    <div className="grid grid-cols-[minmax(0,1.6fr)_139px_99px_109px_119px] items-center gap-3 rounded-(--r-md) border border-(--border) bg-(--surface) p-4 hover:border-(--border-focus) max-[1126px]:grid-cols-[minmax(0,1fr)_auto] max-[1126px]:gap-2.5 max-[704px]:grid-cols-1 max-[704px]:gap-2">
      <div className="flex flex-col gap-0.75">
        <h3 className="text-[15px] font-medium text-(--text)">{title}</h3>
        <p className="m-0 text-[13px] text-(--muted)">{category}</p>
      </div>

      <p className={`text-sm font-medium max-[1126px]:justify-self-start ${amountColor}`}>
        {type === "expense" ? "-" : "+"}
        {formatCurrency(amount)}
      </p>

      <p className="text-[13px] capitalize text-(--muted) max-[1126px]:justify-self-start">
        {type}
      </p>
      <p className="text-[13px] text-(--muted) max-[1126px]:justify-self-start">
        {formatTransactionDate(date)}
      </p>

      {role == "admin" && (
        <div className="flex justify-end gap-2 max-[704px]:justify-start">
          <button
            className="cursor-pointer rounded-(--r-sm) border border-(--border) bg-(--surface) px-3.5 py-1.75 text-[13px] font-medium text-(--green-strong) max-[704px]:flex-1"
            onClick={() => onEdit(transaction)}
          >
            Edit
          </button>
          <button
            className="cursor-pointer rounded-(--r-sm) border border-(--danger-border) bg-(--danger-light) px-3.5 py-1.75 text-[13px] font-medium text-(--danger-text) max-[704px]:flex-1"
            onClick={() => onDelete(transaction.id)}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default TransactionItem;
