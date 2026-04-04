import { useState } from "react";
import "./AddTransactionModal.css";

function AddTransactionModal({ onAdd, onClose, initialData, onEdit }) {
  const isEditMode = Boolean(initialData);

  const initialState = {
    title: "",
    amount: "",
    type: "",
    category: "",
    date: "",
  };

  const [form, setForm] = useState(initialData || initialState);

  // handles any change made to the form and updates the form state accordingly
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
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
      date: form.date,
    };

    if (initialData) {
      onEdit(newTxn);
    } else {
      onAdd(newTxn);
    }
    onClose();
    setForm(initialState);
  };

  // to update the form data if edit is clicked for other txn without closing the modal
  // not required anymore because we dont allow user to edit multiple txn without closing the current modal
  // useEffect(() => {
  //   if (initialData) {
  //     setForm(initialData);
  //   } else {
  //     setForm(initialState);
  //   }
  // }, [initialData]);

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-card__header">
          <h2>{isEditMode ? "Edit" : "Add"} Transaction</h2>
          <p>{isEditMode ? "Update existing entry" : "Create a new transaction"}</p>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="modal-form__grid">
            <label>
              <span>Title</span>
              <input
                type="text"
                placeholder="Title"
                name="title"
                value={form.title}
                onChange={handleChange}
              />
            </label>

            <label>
              <span>Amount</span>
              <input
                type="number"
                placeholder="Amount"
                name="amount"
                value={form.amount}
                onChange={handleChange}
              />
            </label>

            <label>
              <span>Type</span>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </label>

            <label>
              <span>Category</span>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option value="Food">Food</option>
                <option value="Rent">Rent</option>
                <option value="Transportation">Transportation</option>
                <option value="Utilities">Utilities</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Salary">Salary</option>
                <option value="Investment">Investment</option>
              </select>
            </label>

            <label className="modal-form__full">
              <span>Date</span>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="modal-form__actions">
            <button type="submit">{isEditMode ? "Save" : "Add"} Transaction</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTransactionModal;
