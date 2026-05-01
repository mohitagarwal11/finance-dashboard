import { useState } from "react";

const fieldClass =
  "w-full rounded-(--r-md) border border-(--border) bg-(--bg) px-3.5 py-[11px] text-sm text-(--text) outline-none focus:border-(--accent) focus:bg-(--surface) focus:outline-2 focus:outline-offset-2 focus:outline-(--accent)";
const labelClass = "flex flex-col gap-1.5";
const labelTextClass = "text-xs font-medium text-(--muted)";

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
    <div className="fixed inset-0 z-20 grid place-items-center bg-slate-900/40 p-4.5">
      <div className="w-full max-w-130 rounded-(--r-xl) border border-(--border) bg-(--surface)">
        <div className="px-5.5 pt-5.5 pb-2">
          <h2 className="text-[22px] font-bold tracking-normal text-(--text)">
            {isEditMode ? "Edit" : "Add"} Transaction
          </h2>
          <p className="mb-1 mt-0 text-[11px] font-semibold tracking-[0.07em] text-(--muted)">
            {isEditMode ? "Update existing entry" : "Create a new transaction"}
          </p>
        </div>

        <form className="px-5.5 pt-3 pb-5.5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3.5 max-[704px]:grid-cols-1">
            <label className={labelClass}>
              <span className={labelTextClass}>Title</span>
              <input
                className={fieldClass}
                type="text"
                placeholder="Title"
                name="title"
                value={form.title}
                onChange={handleChange}
              />
            </label>

            <label className={labelClass}>
              <span className={labelTextClass}>Amount</span>
              <input
                className={fieldClass}
                type="number"
                placeholder="Amount"
                name="amount"
                value={form.amount}
                onChange={handleChange}
              />
            </label>

            <label className={labelClass}>
              <span className={labelTextClass}>Type</span>
              <select
                className={fieldClass}
                name="type"
                value={form.type}
                onChange={handleChange}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </label>

            <label className={labelClass}>
              <span className={labelTextClass}>Category</span>
              <select
                className={fieldClass}
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

            <label className={`${labelClass} col-span-full`}>
              <span className={labelTextClass}>Date</span>
              <input
                className={fieldClass}
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="mt-4.5 flex justify-end gap-2.5 border-t border-(--border) pt-4.5 max-[704px]:flex-col">
            <button
              className="cursor-pointer rounded-(--r-md) border border-(--accent) bg-(--accent) px-5 py-2.5 text-sm font-semibold text-white"
              type="submit"
            >
              {isEditMode ? "Save" : "Add"} Transaction
            </button>
            <button
              className="cursor-pointer rounded-(--r-md) border border-(--border) bg-(--surface) px-5 py-2.5 text-sm font-semibold text-(--text)"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTransactionModal;
