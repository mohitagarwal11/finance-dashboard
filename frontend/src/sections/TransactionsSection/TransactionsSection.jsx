import { useState } from "react";
import TransactionItem from "../../components/TransactionItem/TransactionItem";
import AddTransactionModal from "../../components/AddTransactionModal/AddTransactionModal";
import Pagination from "../../components/Pagination/Pagination";

const filterFieldClass =
  "w-full rounded-(--r-md) border border-(--border) bg-(--bg) px-3.5 py-2.5 text-[13px] text-(--text) hover:border-(--border-focus) focus:border-(--border-focus) focus:bg-(--surface)";

function TransactionsSection({
  transactions,
  filters,
  setFilters,
  role,
  handleAddTxn,
  handleDeleteTxn,
  handleEditTxn,
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
    const matchesSearch = txn.title
      .toLowerCase()
      .includes(filters.search.toLowerCase());
    const matchesCategory =
      filters.category == "all" ||
      txn.category.toLowerCase() == filters.category.toLowerCase();
    const matchesType =
      filters.type == "all" ||
      txn.type.toLowerCase() == filters.type.toLowerCase();
    return matchesSearch && matchesCategory && matchesType;
  });

  const indexOfLastTxn = currPage * txnPerPage;
  const indexOfFirstTxn = indexOfLastTxn - txnPerPage;
  const currTxns = filteredTransactions.slice(indexOfFirstTxn, indexOfLastTxn);

  return (
    <section className="flex flex-col gap-4 rounded-(--r-lg) border border-(--border) bg-(--surface) p-5 max-[704px]:p-4">
      <div className="flex items-center justify-between gap-3.5 max-[704px]:flex-wrap">
        <div>
          <h2 className="text-xl font-semibold tracking-normal text-(--text)">
            Transaction and Invoices
          </h2>
          <p className="mb-1 mt-0 text-[11px] font-semibold tracking-[0.07em] text-(--muted)">
            Recent financial activities
          </p>
        </div>

        {role === "admin" && (
          <button
            className="shrink-0 cursor-pointer whitespace-nowrap rounded-(--r-md) border-0 bg-(--accent) px-4.5 py-2.5 text-center text-sm font-semibold text-white max-[704px]:w-full"
            onClick={() => setIsModalOpen(true)}
          >
            Add transaction
          </button>
        )}

        <div className="grid grid-cols-[minmax(0,1.5fr)_repeat(2,minmax(139px,0.8fr))] gap-3 max-[704px]:grid-cols-1">
          <input
            className={filterFieldClass}
            type="text"
            placeholder="Search transactions"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />

          <select
            className={filterFieldClass}
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
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
            className={filterFieldClass}
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

      <div className="flex flex-col gap-2.5">
        <div className="grid grid-cols-[minmax(0,1.6fr)_139px_99px_109px_119px] gap-3 px-3.5 text-[11px] font-semibold tracking-wider text-(--muted) max-[704px]:hidden">
          <span>Title</span>
          <span>Amount</span>
          <span>Type</span>
          <span>Date</span>
          {role === "admin" && <span>Actions</span>}
        </div>

        {filteredTransactions.length === 0 ? (
          <p className="m-0 rounded-(--r-md) border border-dashed border-(--border) bg-(--bg) p-5 text-center text-sm text-(--muted)">
            No transactions match these filters.
          </p>
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
          ))
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
