import { useState } from "react";
import { loginUser, registerUser } from "../api/auth";
import dashboardPreview from "../../../assets/dashboard.png";
import transactionsPreview from "../../../assets/transactions.png";

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

    if (e.target.name === "username") {
      const usernameRegex =
        /^(?=.{3,20}$)(?!.*[_.]{2})[a-z0-9](?:[a-z0-9._]*[a-z0-9])?$/;
      if (!usernameRegex.test(e.target.value)) {
        setMessage(
          "Username must be 3-20 characters long and may contain lowercase letters, numbers, dots and underscores only. Dots and underscores cannot appear at the beginning or end.",
        );
      } else {
        setMessage("");
      }
    }
    
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
    <main className="min-h-dvh bg-(--bg) px-3 py-3 text-(--text) sm:px-5 sm:py-5 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100dvh-24px)] w-full max-w-340 grid-cols-[minmax(0,1fr)_minmax(340px,420px)] overflow-hidden rounded-(--r-xl) border border-(--border-strong) bg-(--shell) shadow-[0_24px_80px_rgba(15,23,42,0.14)] max-[1080px]:min-h-0 max-[1080px]:grid-cols-1 max-[640px]:border-0 max-[640px]:bg-transparent max-[640px]:shadow-none">
        <section className="relative flex min-w-0 flex-col gap-10 overflow-hidden px-[clamp(18px,4vw,56px)] py-[clamp(24px,4vw,48px)] max-[1080px]:order-2 max-[640px]:mt-3 max-[640px]:gap-5 max-[640px]:rounded-(--r-xl) max-[640px]:border max-[640px]:border-(--border-strong) max-[640px]:bg-(--shell) max-[640px]:px-5 max-[640px]:py-5 max-[380px]:px-4 max-[380px]:py-4">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(34,197,94,0.18),transparent_28%),radial-gradient(circle_at_86%_18%,rgba(59,130,246,0.16),transparent_30%)]" />
          <div className="relative z-10">
            <div className="mb-10 flex items-center justify-between gap-4 max-[1080px]:mb-8 max-[640px]:hidden">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-end justify-center gap-1 rounded-(--r-md) bg-(--accent) p-2.5 text-white shadow-[0_12px_24px_rgba(22,163,74,0.24)]">
                  <span className="h-3 w-1.5 rounded-full bg-white/80" />
                  <span className="h-5 w-1.5 rounded-full bg-white" />
                  <span className="h-7 w-1.5 rounded-full bg-white/90" />
                </div>
                <p className="text-2xl font-bold text-(--text) max-[360px]:text-xl">
                  FinMo
                </p>
              </div>
            </div>

            <div className="grid items-start gap-8 min-[1280px]:grid-cols-[minmax(300px,0.9fr)_minmax(340px,1fr)] max-[1080px]:grid-cols-[minmax(0,1fr)_minmax(280px,420px)] max-[760px]:grid-cols-1 max-[640px]:gap-0">
              <div className="min-w-0">
                <p className="mb-4 w-fit max-w-full rounded-full border border-(--border) bg-(--surface)/80 px-3 py-1.5 text-xs font-bold text-(--accent) max-[640px]:mb-3">
                  Smart finance, better decisions
                </p>
                <h1 className="max-w-125 text-[clamp(2rem,3.5vw,3rem)] font-bold leading-[1.03] text-(--text) max-[640px]:text-[1.7rem] max-[420px]:text-[1.55rem]">
                  All your finances, one smart dashboard
                </h1>
                <p className="mt-5 max-w-132 text-[1rem] leading-8 text-(--muted) max-[640px]:mt-3 max-[640px]:text-sm max-[640px]:leading-6">
                  FinMo brings transactions, spending trends, and practical
                  insights into one clean dashboard built for everyday money
                  decisions.
                </p>

                <div className="mt-7 flex flex-wrap gap-2.5 max-[640px]:mt-4 max-[640px]:gap-2">
                  {highlights.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-(--border) bg-(--surface)/80 px-3.5 py-2 text-sm font-semibold text-(--text-secondary) max-[640px]:px-3 max-[640px]:py-1.5 max-[640px]:text-xs"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative min-w-0 pt-2 max-[760px]:hidden min-[1280px]:min-h-112">
                <div className="ml-auto w-full max-w-142 overflow-hidden rounded-(--r-xl) border border-(--border-strong) bg-(--surface) shadow-[0_28px_70px_rgba(15,23,42,0.18)] max-[1080px]:rounded-(--r-lg)">
                  <img
                    src={dashboardPreview}
                    alt="FinMo dashboard overview"
                    className="block aspect-16/10 w-full object-cover object-top-left"
                  />
                </div>

                <div className="mt-5 ml-auto w-full max-w-142 overflow-hidden rounded-(--r-xl) border border-(--border-strong) bg-(--surface) shadow-[0_28px_70px_rgba(15,23,42,0.18)] max-[1080px]:hidden">
                  <img
                    src={transactionsPreview}
                    alt="FinMo transactions view"
                    className="block aspect-video w-full object-cover object-top-left"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 grid gap-4 min-[720px]:grid-cols-3 max-[640px]:grid-cols-1 max-[520px]:gap-3">
            {features.map((feature) => (
              <article
                key={feature.label}
                className="rounded-(--r-lg) border border-(--border) bg-(--surface)/86 p-5 shadow-sm backdrop-blur max-[640px]:p-4"
              >
                <span
                  className={`mb-4 block h-9 w-9 rounded-(--r-sm) ${feature.tone} max-[640px]:mb-3 max-[640px]:h-7 max-[640px]:w-7`}
                />
                <h2 className="text-base font-bold text-(--text)">
                  {feature.label}
                </h2>
                <p className="mt-2 text-sm leading-6 text-(--muted) max-[640px]:leading-5">
                  {feature.copy}
                </p>
              </article>
            ))}
          </div>
        </section>

        <aside className="flex min-w-0 items-start justify-center border-l border-(--border-strong) bg-(--surface) px-[clamp(16px,3.6vw,44px)] py-[clamp(36px,7vh,76px)] max-[1080px]:order-1 max-[1080px]:border-b max-[1080px]:border-l-0 max-[640px]:min-h-dvh max-[640px]:items-center max-[640px]:border-0 max-[640px]:bg-(--bg) max-[640px]:px-4 max-[640px]:py-4 max-[380px]:px-3 max-[380px]:py-3">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-100 rounded-(--r-xl) border border-(--border-strong) bg-(--surface) p-6 shadow-[0_24px_70px_rgba(15,23,42,0.12)] max-[1080px]:max-w-108 max-[640px]:p-5 max-[380px]:p-4 max-[340px]:rounded-(--r-lg) max-[340px]:p-3.5"
          >
            <div className="mb-5 max-[380px]:mb-4">
              <div className="mb-5 hidden items-center gap-3 max-[640px]:flex max-[380px]:mb-4">
                <div className="flex h-10 w-10 shrink-0 items-end justify-center gap-1 rounded-(--r-md) bg-(--accent) p-2 text-white shadow-[0_12px_24px_rgba(22,163,74,0.24)]">
                  <span className="h-2.5 w-1.5 rounded-full bg-white/80" />
                  <span className="h-4 w-1.5 rounded-full bg-white" />
                  <span className="h-6 w-1.5 rounded-full bg-white/90" />
                </div>
                <p className="text-2xl font-bold text-(--text)">FinMo</p>
              </div>
              <h2 className="mt-2 text-2xl font-bold text-(--text) max-[420px]:text-2xl max-[380px]:text-[1.45rem]">
                {isLogin ? "Log in to FinMo" : "Create your account"}
              </h2>
            </div>

            <div className="mb-5 grid grid-cols-2 rounded-(--r-md) border border-(--border) bg-(--bg) p-1 max-[380px]:mb-4">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`min-w-0 rounded-[10px] px-3 py-2.5 text-sm font-bold max-[380px]:py-2 ${
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
                className={`min-w-0 rounded-[10px] px-3 py-2.5 text-sm font-bold max-[380px]:py-2 ${
                  !isLogin
                    ? "bg-(--surface) text-(--text) shadow-sm"
                    : "text-(--muted)"
                }`}
              >
                Sign up
              </button>
            </div>

            <label className="mb-2 block text-sm font-bold text-(--text) max-[380px]:mb-1.5">
              Username
            </label>
            <input
              name="username"
              placeholder="Enter your username"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
              className="mb-4 w-full min-w-0 rounded-(--r-md) border border-(--border) bg-(--bg) px-4 py-3 text-(--text) outline-none focus:border-(--border-focus) max-[380px]:mb-3 max-[380px]:py-2.5"
            />

            {!isLogin && (
              <>
                <label className="mb-2 block text-sm font-bold text-(--text) max-[380px]:mb-1.5">
                  Email address
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  className="mb-4 w-full min-w-0 rounded-(--r-md) border border-(--border) bg-(--bg) px-4 py-3 text-(--text) outline-none focus:border-(--border-focus) max-[380px]:mb-3 max-[380px]:py-2.5"
                />
              </>
            )}

            <label className="mb-2 block text-sm font-bold text-(--text) max-[380px]:mb-1.5">
              Password
            </label>
            <div className="mb-5 flex w-full items-center rounded-(--r-md) border border-(--border) bg-(--bg) focus-within:border-(--border-focus) max-[380px]:mb-4">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                autoComplete={isLogin ? "current-password" : "new-password"}
                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-(--text) outline-none max-[380px]:py-2.5 max-[340px]:px-3"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="shrink-0 px-4 py-3 text-sm font-bold text-(--accent) max-[380px]:py-2.5 max-[340px]:px-3"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <button
              type="submit"
              className="w-full rounded-(--r-md) bg-(--accent) px-4 py-3.5 font-bold text-white shadow-[0_14px_30px_rgba(22,163,74,0.24)] hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent) max-[380px]:py-3"
            >
              {isLogin ? "Log in" : "Create account"}
            </button>

            {message && (
              <p className="mt-4 rounded-(--r-md) border border-(--danger-border) bg-(--danger-light) px-4 py-3 text-sm font-semibold text-(--danger-text)">
                {message}
              </p>
            )}

            <p className="mt-5 text-center text-sm text-(--muted) max-[380px]:mt-4">
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
