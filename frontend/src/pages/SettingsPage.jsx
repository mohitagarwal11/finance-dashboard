import { useState } from "react";
import { Link } from "react-router-dom";
import { setStoredUser } from "../api/tokenStore";

function SettingsPage({
  userData,
  setUserData,
  expenseLimit,
  setExpenseLimit,
}) {
  const [name, setName] = useState(userData?.name || userData?.username || "");
  const [limit, setLimit] = useState(expenseLimit || 0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: call API to save profile and expense limit
      setExpenseLimit(Number(limit));

      const updatedUser = { ...(userData || {}), name };
      setStoredUser(updatedUser);
      if (typeof setUserData === "function") setUserData(updatedUser);

      setMessage("Saved.");
    } catch (error) {
      setMessage(error?.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-dvh p-6">
      <div className="mx-auto max-w-340 rounded-(--r-xl) border border-(--border-strong) bg-(--shell) p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Settings</h2>
          <Link to="/dashboard" className="text-sm text-(--muted)">
            ← Back to dashboard
          </Link>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-(--r-md) border px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Email</label>
            <input
              value={userData?.email || ""}
              readOnly
              className="w-full rounded-(--r-md) border px-3 py-2 bg-(--bg)"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">
              Monthly expense limit
            </label>
            <input
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              type="number"
              className="w-full rounded-(--r-md) border px-3 py-2"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              disabled={loading}
              className="rounded-(--r-md) bg-(--accent) px-4 py-2 text-white"
            >
              {loading ? "Saving..." : "Save changes"}
            </button>
            <button type="button" className="rounded-(--r-md) border px-4 py-2">
              Export CSV
            </button>
            <label className="rounded-(--r-md) border px-4 py-2 cursor-pointer">
              Import CSV
              <input type="file" accept=".csv" className="hidden" />
            </label>
          </div>

          <div className="mt-4 border-t pt-4">
            <button
              type="button"
              className="rounded-(--r-md) border px-4 py-2 text-(--danger-text)"
            >
              Delete all data
            </button>
            <button
              type="button"
              className="ml-3 rounded-(--r-md) border px-4 py-2 text-(--danger-text)"
            >
              Delete account
            </button>
          </div>

          {message && <p className="mt-3 text-sm">{message}</p>}
        </form>
      </div>
    </main>
  );
}

export default SettingsPage;
