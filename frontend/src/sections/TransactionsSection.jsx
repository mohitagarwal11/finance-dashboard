import TransactionItem from '../components/TransactionItem';
import AddTransactionModal from '../components/AddTransactionModal';
import { useState } from 'react';

function TransactionsSection({
  transactions,
  filters,
  setFilters,
  role,
  handleAddTxn,
  handleDeleteTxn,
  handleEditTxn
}) {
  // to keep track of the form modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // to keep track of the txn being edited
  const [editingTxn, setEditingTxn] = useState(null);

  // applying all the filters together to get the final list to render
  const filteredTransactions = transactions.filter((txn) => {
    // using includes so that we can search by each letter instead of the whole word
    const matchesSearch = txn.title.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCategory =
      filters.category == "all" ||
      txn.category.toLowerCase() == filters.category.toLowerCase();
    const matchesType =
      filters.type == "all" || txn.type.toLowerCase() == filters.type.toLowerCase();
    return matchesSearch && matchesCategory && matchesType;
  });
  return (
    <div>

      {/* search filter */}
      <input
        type="text"
        placeholder="Search..."
        value={filters.search}
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
      />

      {/* category filter */}
      <select
        value={filters.category}
        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
      >
        <option value="all">All Categories</option>
        <option value="food">Food</option>
        <option value="rent">Rent</option>
        <option value="transportation">Transportation</option>
        <option value="utilities">Utilities</option>
        <option value="entertainment">Entertainment</option>
        <option value="salary">Salary</option>
        <option value="investment">Investment</option>
      </select>

      {/* type filter */}
      <select
        value={filters.type}
        onChange={(e) => setFilters({ ...filters, type: e.target.value })}
      >
        <option value="all">All</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      {/* if admin mode then we allow for add transaction to show */}
      {role === "admin" && (
        <button onClick={() => setIsModalOpen(true)}>Add Transaction</button>
      )}
      {/* if isModalOpen true then we render the modal */}
      {isModalOpen && (
        <AddTransactionModal
          onAdd={handleAddTxn}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTxn(null);
          }}
          initialData={editingTxn}
          onEdit={handleEditTxn}
        />
      )
      }

      <h2>Transactions</h2>
      {/* rendering on filtered list */}
      {filteredTransactions.map((txn) => (
        <TransactionItem
          key={txn.id}
          transaction={txn}
          role={role}
          onEdit={(txn) => {
            setEditingTxn(txn);
            setIsModalOpen(true);
          }}
          onDelete={handleDeleteTxn}
        />
      ))}
    </div>
  );
}

export default TransactionsSection;
