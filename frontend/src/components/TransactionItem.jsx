function TransactionItem({ transaction, role, onEdit, onDelete }) {
  const { title, amount, type, category, date } = transaction;
  return (
    <div className="transaction-item">
      <h3>{title}</h3>
      <p>Amount: {amount}</p>
      <p>Type: {type}</p>
      <p>Category: {category}</p>
      <p>Date: {date}</p>
      {role == "admin" && (
        <>
          <button onClick={() => onEdit(transaction)}>Edit</button>
          <button onClick={() => onDelete(transaction.id)}>Delete</button>
        </>
      )}
    </div>
  );
}

export default TransactionItem;
