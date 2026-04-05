import { useState } from 'react';
import "./TransactionsSection.css";
import TransactionItem from '../../components/TransactionItem/TransactionItem';
import AddTransactionModal from '../../components/AddTransactionModal/AddTransactionModal';
import Pagination from '../../components/Pagination/Pagination';

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

  const [currPage, setCurrPage] = useState(1);
  const txnPerPage = 10;

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

  const indexOfLastTxn = currPage * txnPerPage;
  const indexOfFirstTxn = indexOfLastTxn - txnPerPage;
  const currTxns = filteredTransactions.slice(indexOfFirstTxn, indexOfLastTxn);

  return (
    <section className="transactions-section">
      <div className="transactions-section__header">
        <div>
          <h2>Transaction and Invoices</h2>
          <p className="transactions-section__eyebrow">Recent financial activities</p>
        </div>

        {role === "admin" && (
          <button
            className="transactions-section__add-button"
            onClick={() => setIsModalOpen(true)}
          >
            Add transaction
          </button>
        )}

        <div className="transactions-section__filters">
          <input
            type="text"
            placeholder="Search transactions"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />

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

          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
      </div>

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
      )}

      <div className="transactions-list">
        <div className="transactions-list__head">
          <span>Title</span>
          <span>Amount</span>
          <span>Type</span>
          <span>Date</span>
          {role === "admin" && <span>Actions</span>}
        </div>

        {filteredTransactions.length === 0 ? (
          <p className="transactions-list__empty">No transactions match these filters.</p>
        ) : (
          currTxns.map((txn) => (
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
          )
          )
        )}
        <Pagination
          txnPerPage={txnPerPage}
          setCurrPage={setCurrPage}
          totalTxn={filteredTransactions.length}
        />
      </div>
    </section>
  );
}

export default TransactionsSection;
