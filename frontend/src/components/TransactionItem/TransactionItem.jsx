import "./TransactionItem.css";
import { formatCurrency, formatTransactionDate } from "../../utils/formatters";

function TransactionItem({ transaction, role, onEdit, onDelete }) {
  const { title, amount, type, category, date } = transaction;

  return (
    <div className="transaction-item">
      <div className="transaction-item__title">
        <h3>{title}</h3>
        <p>{category}</p>
      </div>

      <p className={`transaction-item__amount transaction-item__amount--${type}`}>
        {type === "expense" ? "-" : "+"}
        {formatCurrency(amount)}
      </p>

      <p className="transaction-item__type">{type}</p>
      <p className="transaction-item__date">{formatTransactionDate(date)}</p>

      {role == "admin" && (
        <div className="transaction-item__actions">
          <button onClick={() => onEdit(transaction)}>Edit</button>
          <button onClick={() => onDelete(transaction.id)}>Delete</button>
        </div>
      )}
    </div>
  );
}

export default TransactionItem;
