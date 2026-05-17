import { useState } from "react";
import { loginUser, registerUser } from "../api/auth";
import dashboardPreview from "../../../assets/dashboard.png";
import chartsPreview from "../../../assets/charts.png";

const features = [
  {
    label: "Track cashflow",
    copy: "See income, spending, and savings without jumping between screens.",
    tone: "bg-emerald-500",
  },
  {
    label: "Spot patterns",
    copy: "Monthly charts make recurring habits and budget pressure easier to read.",
    tone: "bg-blue-500",
  },
  {
    label: "Act faster",
    copy: "Filter, edit, and review transactions from one focused workspace.",
    tone: "bg-amber-500",
  },
];

const highlights = [
  "Personal dashboard",
  "Category insights",
  "Expense limits",
  "Transaction history",
];

// it has two modes - login and register
function AuthPage({ onAuthSuccess }) {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    if (e.target.name === "password" && e.target.value.length < 8) {
      setMessage("Password must be at least 8 characters long");
    } else {
      setMessage("");
    }

    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const trimmedForm = {
        ...form,
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password.trim(),
      };

      if (
        [trimmedForm.username, trimmedForm.password].some(
          (field) => field === "",
        ) ||
        (mode === "register" && trimmedForm.email === "")
      ) {
        setMessage("All fields are required");
        return;
      } else {
        setMessage("");
      }

      if (trimmedForm.password.length < 8) {
        setMessage("Password must be at least 8 characters long");
        return;
      }

      const payload =
        mode === "register"
          ? trimmedForm
          : {
              username: trimmedForm.username,
              password: trimmedForm.password,
            };

      const response =
        mode === "register"
          ? await registerUser(payload)
          : await loginUser(payload);

      onAuthSuccess(response.data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong!");
    }
  };

  const isLogin = mode === "login";

  return (
    <main className="min-h-dvh overflow-hidden bg-(--bg) px-4 py-4 text-(--text) sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100dvh-32px)] w-full max-w-360 grid-cols-[minmax(0,1fr)_minmax(380px,480px)] overflow-hidden rounded-(--r-xl) border border-(--border-strong) bg-(--shell) shadow-[0_24px_80px_rgba(15,23,42,0.14)] max-[980px]:grid-cols-1">
        <section className="relative flex min-w-0 flex-col justify-between overflow-hidden px-[clamp(24px,5vw,72px)] py-[clamp(26px,5vw,56px)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(34,197,94,0.18),transparent_28%),radial-gradient(circle_at_86%_18%,rgba(59,130,246,0.16),transparent_30%)]" />
          <div className="relative z-10">
            <div className="mb-14 flex items-center justify-between gap-4 max-[640px]:mb-9">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-end justify-center gap-1 rounded-(--r-md) bg-(--accent) p-2.5 text-white shadow-[0_12px_24px_rgba(22,163,74,0.24)]">
                  <span className="h-3 w-1.5 rounded-full bg-white/80" />
                  <span className="h-5 w-1.5 rounded-full bg-white" />
                  <span className="h-7 w-1.5 rounded-full bg-white/90" />
                </div>
                <p className="text-2xl font-bold text-(--text)">FinMo</p>
              </div>
            </div>

            <div className="grid items-start gap-10 min-[1280px]:grid-cols-[minmax(340px,0.9fr)_minmax(380px,1.1fr)]">
              <div className="min-w-0">
                <p className="mb-4 w-fit rounded-full border border-(--border) bg-(--surface)/80 px-3 py-1.5 text-xs font-bold text-(--accent)">
                  Smart finance, better decisions
                </p>
                <h1 className="max-w-125 text-[clamp(2rem,2.75vw,4.75rem)] font-bold leading-[1.02] text-(--text)">
                  All your finances, one smart dashboard
                </h1>
                <p className="mt-6 max-w-132 text-lg leading-8 text-(--text-secondary) max-[640px]:text-base max-[640px]:leading-7">
                  FinMo brings transactions, spending trends, and practical
                  insights into one clean dashboard built for everyday money
                  decisions.
                </p>

                <div className="mt-8 flex flex-wrap gap-2.5">
                  {highlights.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-(--border) bg-(--surface)/80 px-3.5 py-2 text-sm font-semibold text-(--text-secondary)"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative min-h-112 min-w-0 pt-2 max-[1279px]:hidden">
                <div className="ml-auto w-full max-w-142 overflow-hidden rounded-(--r-xl) border border-(--border-strong) bg-(--surface) shadow-[0_28px_70px_rgba(15,23,42,0.18)]">
                  <img
                    src={dashboardPreview}
                    alt="FinMo dashboard overview"
                    className="block w-full object-cover object-top-left"
                  />
                </div>

                <div className="ml-auto w-full max-w-142 mt-6 overflow-hidden rounded-(--r-xl) border border-(--border-strong) bg-(--surface) shadow-[0_28px_70px_rgba(15,23,42,0.18)]">
                  <img
                    src={chartsPreview}
                    alt="FinMo chart analytics"
                    className="block w-full object-cover object-top-left"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-14 grid gap-4 min-[720px]:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.label}
                className="rounded-(--r-lg) border border-(--border) bg-(--surface)/86 p-5 shadow-sm backdrop-blur"
              >
                <span
                  className={`mb-5 block h-9 w-9 rounded-(--r-sm) ${feature.tone}`}
                />
                <h2 className="text-base font-bold text-(--text)">
                  {feature.label}
                </h2>
                <p className="mt-2 text-sm leading-6 text-(--muted)">
                  {feature.copy}
                </p>
              </article>
            ))}
          </div>
        </section>

        <aside className="flex min-w-0 items-center justify-center border-l border-(--border-strong) bg-(--surface) px-[clamp(20px,4vw,56px)] py-10 max-[980px]:border-l-0 max-[980px]:border-t">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-106 rounded-(--r-xl) border border-(--border-strong) bg-(--surface) p-7 shadow-[0_24px_70px_rgba(15,23,42,0.12)] max-[480px]:p-5"
          >
            <div className="mb-7">
              <h2 className="mt-2 text-3xl font-bold text-(--text)">
                {isLogin ? "Log in to FinMo" : "Create your account"}
              </h2>
              <p className="mt-3 text-sm leading-6 text-(--muted)">
                {isLogin
                  ? "Pick up where you left off with your personal finance dashboard."
                  : "Create a secure workspace for tracking your everyday money."}
              </p>
            </div>

            <div className="mb-5 grid grid-cols-2 rounded-(--r-md) border border-(--border) bg-(--bg) p-1">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`rounded-[10px] px-3 py-2.5 text-sm font-bold ${
                  isLogin
                    ? "bg-(--surface) text-(--text) shadow-sm"
                    : "text-(--muted)"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setMode("register")}
                className={`rounded-[10px] px-3 py-2.5 text-sm font-bold ${
                  !isLogin
                    ? "bg-(--surface) text-(--text) shadow-sm"
                    : "text-(--muted)"
                }`}
              >
                Sign up
              </button>
            </div>

            <label className="mb-2 block text-sm font-bold text-(--text)">
              Username
            </label>
            <input
              name="username"
              placeholder="Enter your username"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
              className="mb-4 w-full rounded-(--r-md) border border-(--border) bg-(--bg) px-4 py-3 text-(--text) outline-none focus:border-(--border-focus)"
            />

            {!isLogin && (
              <>
                <label className="mb-2 block text-sm font-bold text-(--text)">
                  Email address
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  className="mb-4 w-full rounded-(--r-md) border border-(--border) bg-(--bg) px-4 py-3 text-(--text) outline-none focus:border-(--border-focus)"
                />
              </>
            )}

            <label className="mb-2 block text-sm font-bold text-(--text)">
              Password
            </label>
            <div className="mb-5 flex w-full items-center rounded-(--r-md) border border-(--border) bg-(--bg) focus-within:border-(--border-focus)">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                autoComplete={isLogin ? "current-password" : "new-password"}
                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-(--text) outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="px-4 py-3 text-sm font-bold text-(--accent)"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <button
              type="submit"
              className="w-full rounded-(--r-md) bg-(--accent) px-4 py-3.5 font-bold text-white shadow-[0_14px_30px_rgba(22,163,74,0.24)] hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
            >
              {isLogin ? "Log in" : "Create account"}
            </button>

            {message && (
              <p className="mt-4 rounded-(--r-md) border border-(--danger-border) bg-(--danger-light) px-4 py-3 text-sm font-semibold text-(--danger-text)">
                {message}
              </p>
            )}

            <p className="mt-6 text-center text-sm text-(--muted)">
              {isLogin ? "New to FinMo?" : "Already using FinMo?"}{" "}
              <button
                type="button"
                onClick={() => setMode(isLogin ? "register" : "login")}
                className="font-bold text-(--accent)"
              >
                {isLogin ? "Create an account" : "Log in"}
              </button>
            </p>
          </form>
        </aside>
      </div>
    </main>
  );
}

export default AuthPage;
