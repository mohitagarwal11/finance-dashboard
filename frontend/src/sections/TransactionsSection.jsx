import TransactionItem from '../components/TransactionItem';

function TransactionsSection({
  transactions,
  setTransactions,
  filters,
  setFilters,
  role,
}) {
  // crud operation handlers
  function handleAddTxn() {
    console.log("Add Transaction button clicked");
  }

  function handleDeleteTxn(id) {
    console.log("Delete Transaction with id:", id);
  }

  function handleEditTxn(transaction) {
    console.log("Edit Transaction:", transaction);
  }

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
  return <>
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

      {role === "admin" && (
        <button onClick={handleAddTxn}>Add Transaction</button>
      )}

      <h2>Transactions</h2>
      {/* rendering on filtered list */}
      {filteredTransactions.map((txn) => (
        <TransactionItem
          key={txn.id}
          transaction={txn}
          role={role}
          onEdit={handleEditTxn}
          onDelete={handleDeleteTxn}
        />
      ))}
    </div>
  </>;
}

export default TransactionsSection;
