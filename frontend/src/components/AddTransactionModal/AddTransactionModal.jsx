import { useState, useEffect } from 'react';
import "./AddTransactionModal.css"

function AddTransactionModal({ onAdd, onClose, initialData, onEdit }) {
  const isEditMode = Boolean(initialData);

  const initialState = {
    title: "",
    amount: "",
    type: "expense",
    category: "food",
    date: ""
  };

  const [form, setForm] = useState(initialData || initialState);

  // handles any change made to the form and updates the form state accordingly
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // handles submit form with validation
  const handleSubmit = (e) => {
    e.preventDefault();
    // validation check needs btr ui
    if (!form.title || !form.amount || !form.category || !form.date) {
      alert("Please fill all the fields");
      return;
    }

    if (Number(form.amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    const newTxn = {
      id: initialData?.id || `txn_${Date.now()}`,
      title: form.title.trim(),
      amount: Number(form.amount),
      type: form.type,
      category: form.category,
      date: form.date
    };

    if (initialData) {
      onEdit(newTxn);
    } else {
      onAdd(newTxn);
    }
    onClose();
    setForm(initialState);
  }

  // to update the form data if edit is clicked for other txn without closing the modal
  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm(initialState);
    }
  }, [initialData]);

  return (
    <div>
      <h2>{isEditMode ? "Edit" : "Add"} Transaction</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
        />
        <input
          type="number"
          placeholder="Amount"
          name="amount"
          value={form.amount}
          onChange={handleChange}
        />
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
        >
          <option value="food">Food</option>
          <option value="rent">Rent</option>
          <option value="transportation">Transportation</option>
          <option value="utilities">Utilities</option>
          <option value="entertainment">Entertainment</option>
          <option value="salary">Salary</option>
          <option value="investment">Investment</option>
        </select>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
        />
        <button type="submit">{isEditMode ? "Save" : "Add"} Transaction</button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
};
export default AddTransactionModal;