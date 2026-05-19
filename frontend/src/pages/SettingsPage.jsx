import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteAccount, updateUserSettings } from "../api/auth";
import { deleteAllTransactions } from "../api/transactions";
import { clearAuthStorage, setStoredUser } from "../api/tokenStore";
import { formatCurrency } from "../utils/formatters";

const fieldClass =
  "w-full rounded-(--r-md) border border-(--border) bg-(--bg) px-3.5 py-3 text-sm text-(--text) outline-none hover:border-(--border-focus) focus:border-(--border-focus) focus:bg-(--surface)";

const buttonClass =
  "cursor-pointer rounded-(--r-md) px-4 py-2.5 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2";

const destructiveActions = {
  data: {
    title: "Delete all data",
    keyword: "DELETE DATA",
    description:
      "This permanently removes every transaction from your account. Your profile and login will stay active.",
    confirmLabel: "I understand my transaction history will be deleted.",
    buttonLabel: "Delete all data",
    loadingLabel: "Deleting data...",
  },
  account: {
    title: "Delete account",
    keyword: "DELETE ACCOUNT",
    description:
      "This permanently removes your account, saved settings, and all transaction history.",
    confirmLabel: "I understand my account cannot be restored.",
    buttonLabel: "Delete account",
    loadingLabel: "Deleting account...",
  },
};

function getExpenseLimitValue(userData, expenseLimit) {
  const parsedLimit = Number(userData?.expenseLimit ?? expenseLimit);
  return Number.isFinite(parsedLimit) ? parsedLimit : 0;
}

function getDisplayName(userData) {
  return userData?.displayName || userData?.name || userData?.username || "";
}

function getInitials(name) {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  const initials =
    (parts[0]?.[0] || "").toUpperCase() + (parts[1]?.[0] || "").toUpperCase();
  return initials || name.slice(0, 2).toUpperCase();
}

function formatDate(dateValue) {
  if (!dateValue) return "Recently";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Recently";

  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function ConfirmDestructiveModal({ action, isWorking, onClose, onConfirm }) {
  const [isChecked, setIsChecked] = useState(false);
  const [typedValue, setTypedValue] = useState("");
  const actionConfig = destructiveActions[action];

  if (!actionConfig) return null;

  const canConfirm = isChecked && typedValue === actionConfig.keyword;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 px-4">
      <section className="w-full max-w-116 rounded-(--r-lg) border border-(--border-strong) bg-(--surface) p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-(--border) pb-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.08em] text-(--danger-text)">
              CONFIRM ACTION
            </p>
            <h2 className="mt-1 text-xl font-semibold text-(--text)">
              {actionConfig.title}
            </h2>
          </div>
          <button
            type="button"
            className="h-9 w-9 cursor-pointer rounded-(--r-sm) border border-(--border) bg-(--bg) text-sm font-semibold text-(--muted) hover:border-(--border-focus)"
            onClick={onClose}
            disabled={isWorking}
            aria-label="Close confirmation"
          >
            x
          </button>
        </div>

        <p className="mt-4 text-sm leading-6 text-(--text-secondary)">
          {actionConfig.description}
        </p>

        <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-(--r-md) border border-(--danger-border) bg-(--danger-light) p-3 text-sm font-semibold text-(--danger-text)">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
            className="mt-1 h-4 w-4 accent-(--danger-text)"
          />
          <span>{actionConfig.confirmLabel}</span>
        </label>

        <div className="mt-4">
          <label className="mb-1.5 block text-xs font-semibold text-(--muted)">
            Type {actionConfig.keyword} to confirm
          </label>
          <input
            value={typedValue}
            onChange={(e) => setTypedValue(e.target.value)}
            className={fieldClass}
            autoFocus
          />
        </div>

        <div className="mt-5 flex justify-end gap-2.5">
          <button
            type="button"
            className={`${buttonClass} border border-(--border-strong) bg-(--bg) text-(--text)`}
            onClick={onClose}
            disabled={isWorking}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`${buttonClass} border border-(--danger-border) bg-(--danger-light) text-(--danger-text) disabled:cursor-not-allowed disabled:opacity-50`}
            onClick={onConfirm}
            disabled={!canConfirm || isWorking}
          >
            {isWorking ? actionConfig.loadingLabel : actionConfig.buttonLabel}
          </button>
        </div>
      </section>
    </div>
  );
}

function SettingsPage({
  userData,
  setUserData,
  transactions = [],
  setTransactions,
  expenseLimit,
  setExpenseLimit,
}) {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(getDisplayName(userData));
  const [limit, setLimit] = useState(() =>
    getExpenseLimitValue(userData, expenseLimit),
  );
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [destructiveLoading, setDestructiveLoading] = useState(false);

  const profileName = getDisplayName(userData) || "User";
  const initials = getInitials(profileName);
  const transactionCount = transactions.length;
  const memberSince = useMemo(
    () => formatDate(userData?.createdAt),
    [userData?.createdAt],
  );

  useEffect(() => {
    setDisplayName(getDisplayName(userData));
    setLimit(getExpenseLimitValue(userData, expenseLimit));
  }, [expenseLimit, userData]);

  const handleSave = async (e) => {
    e.preventDefault();

    const parsedLimit = Number(limit);

    if (!Number.isFinite(parsedLimit) || parsedLimit < 0) {
      setMessage("Expense limit must be a non-negative number.");
      return;
    }

    setLoading(true);
    try {
      const response = await updateUserSettings({
        displayName: displayName.trim(),
        expenseLimit: parsedLimit,
      });
      const updatedUser = response.data?.data?.user || {
        ...(userData || {}),
        displayName: displayName.trim(),
        expenseLimit: parsedLimit,
      };

      setExpenseLimit(Number(updatedUser.expenseLimit));
      setStoredUser(updatedUser);
      if (typeof setUserData === "function") setUserData(updatedUser);

      setMessage("Settings saved.");
    } catch (error) {
      setMessage(
        error.response?.data?.message || error?.message || "Failed to save",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDestructiveAction = async () => {
    if (!pendingAction) return;

    setDestructiveLoading(true);
    try {
      if (pendingAction === "data") {
        await deleteAllTransactions();
        if (typeof setTransactions === "function") setTransactions([]);
        setMessage("All transaction data was deleted.");
        setPendingAction(null);
        return;
      }

      await deleteAccount();
      clearAuthStorage();
      if (typeof setTransactions === "function") setTransactions([]);
      if (typeof setUserData === "function") setUserData(null);
      navigate("/", { replace: true });
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          error?.message ||
          "The delete action failed",
      );
    } finally {
      setDestructiveLoading(false);
    }
  };

  return (
    <main className="min-h-dvh w-full px-[clamp(15px,3vw,35px)] py-6 pb-9 max-[792px]:px-2 max-[792px]:pt-3">
      <div className="mx-auto flex w-full max-w-356 flex-col gap-4 rounded-(--r-xl) border border-(--border-strong) bg-(--shell) p-5 transition-colors duration-180 max-[792px]:rounded-(--r-lg) max-[792px]:p-3.5">
        <header className="flex items-center justify-between gap-4 border-b border-(--border-strong) px-1 pt-2 pb-5 max-[792px]:flex-col max-[792px]:items-start">
          <div className="flex min-w-0 items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-(--r-md) bg-(--accent) text-sm font-semibold tracking-[0.02em] text-white">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium tracking-[0.07em] text-(--muted)">
                Account settings
              </p>
              <h1 className="truncate text-[30px] font-semibold tracking-normal text-(--text) max-[792px]:text-[25px]">
                {profileName}
              </h1>
            </div>
          </div>

          <Link
            to="/dashboard"
            className={`${buttonClass} border border-(--border-strong) bg-(--bg) text-(--text) hover:border-(--border-focus) max-[792px]:w-full max-[792px]:text-center`}
          >
            Back to dashboard
          </Link>
        </header>

        <section className="grid grid-cols-3 gap-3.5 max-[850px]:grid-cols-1">
          <div className="rounded-(--r-lg) border border-(--border) bg-(--surface) p-5">
            <p className="text-[11px] font-semibold tracking-[0.07em] text-(--muted)">
              EMAIL
            </p>
            <p className="mt-3 truncate text-lg font-semibold text-(--text)">
              {userData?.email || "Not provided"}
            </p>
          </div>
          <div className="rounded-(--r-lg) border border-(--border) bg-(--surface) p-5">
            <p className="text-[11px] font-semibold tracking-[0.07em] text-(--muted)">
              MONTHLY LIMIT
            </p>
            <p className="mt-3 text-lg font-semibold text-(--green-strong)">
              {formatCurrency(getExpenseLimitValue(userData, expenseLimit))}
            </p>
          </div>
          <div className="rounded-(--r-lg) border border-(--border) bg-(--surface) p-5">
            <p className="text-[11px] font-semibold tracking-[0.07em] text-(--muted)">
              TRANSACTIONS
            </p>
            <p className="mt-3 text-lg font-semibold text-(--text)">
              {transactionCount.toLocaleString()} saved
            </p>
          </div>
        </section>

        <form
          onSubmit={handleSave}
          className="grid grid-cols-[minmax(0,1.25fr)_minmax(300px,0.75fr)] gap-4 max-[980px]:grid-cols-1"
        >
          <section className="rounded-(--r-lg) border border-(--border) bg-(--surface) p-5">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-(--text)">
                  Profile details
                </h2>
                <p className="mt-1 text-sm text-(--muted)">
                  Keep your dashboard personal and your budget guardrail
                  current.
                </p>
              </div>
              <span className="shrink-0 rounded-(--r-sm) border border-(--border) bg-(--bg) px-3 py-1.5 text-xs font-semibold text-(--muted)">
                Since {memberSince}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 max-[704px]:grid-cols-1">
              <div>
                <label className="mb-1.5 block text-sm font-bold text-(--text)">
                  Display name
                </label>
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className={fieldClass}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-(--text)">
                  Monthly expense limit
                </label>
                <input
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  type="number"
                  min="0"
                  className={fieldClass}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-1.5 block text-sm font-bold text-(--text)">
                Email
              </label>
              <input
                value={userData?.email || ""}
                readOnly
                className={`${fieldClass} cursor-not-allowed text-(--muted)`}
              />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                disabled={loading}
                className={`${buttonClass} border border-(--accent) bg-(--accent) text-white disabled:cursor-not-allowed disabled:opacity-70`}
              >
                {loading ? "Saving..." : "Save changes"}
              </button>
              {message && (
                <p className="text-sm font-semibold text-(--text-secondary)">
                  {message}
                </p>
              )}
            </div>
          </section>

          <aside className="flex flex-col gap-4">
            <section className="rounded-(--r-lg) border border-(--border) bg-(--surface) p-5">
              <h2 className="text-xl font-semibold text-(--text)">
                Data tools (Coming soon)
              </h2>
              <p className="mt-1 text-sm text-(--muted)">
                Move your records in or out of the dashboard.
              </p>

              <div className="mt-4 grid gap-3">
                <button
                  type="button"
                  className={`${buttonClass} border border-(--border-strong) bg-(--bg) text-(--text) hover:border-(--border-focus)`}
                >
                  Export CSV
                </button>
                <label
                  className={`${buttonClass} border border-(--border-strong) bg-(--bg) text-center text-(--text) hover:border-(--border-focus)`}
                >
                  Import CSV
                  {/* <input type="file" accept=".csv" className="hidden" /> */}
                </label>
              </div>
            </section>

            <section className="rounded-(--r-lg) border border-(--danger-border) bg-(--danger-light) p-5">
              <p className="text-[11px] font-semibold tracking-[0.07em] text-(--danger-text)">
                DANGER ZONE
              </p>
              <h2 className="mt-1 text-xl font-semibold text-(--text)">
                Destructive actions
              </h2>
              <p className="mt-1 text-sm text-(--text-secondary)">
                These changes are permanent, so each action asks for a second
                confirmation before it runs.
              </p>

              <div className="mt-4 grid gap-3">
                <button
                  type="button"
                  onClick={() => setPendingAction("data")}
                  className={`${buttonClass} border border-(--danger-border) bg-(--surface) text-(--danger-text) hover:border-(--danger-text)`}
                >
                  Delete all data
                </button>
                <button
                  type="button"
                  onClick={() => setPendingAction("account")}
                  className={`${buttonClass} border border-(--danger-border) bg-(--surface) text-(--danger-text) hover:border-(--danger-text)`}
                >
                  Delete account
                </button>
              </div>
            </section>
          </aside>
        </form>
      </div>

      {pendingAction && (
        <ConfirmDestructiveModal
          action={pendingAction}
          isWorking={destructiveLoading}
          onClose={() => {
            if (!destructiveLoading) setPendingAction(null);
          }}
          onConfirm={handleConfirmDestructiveAction}
        />
      )}
    </main>
  );
}

export default SettingsPage;
