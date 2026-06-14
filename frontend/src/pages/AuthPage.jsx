import { useEffect, useState } from "react";
import dashboardPreview from "../../../assets/dashboard.png";
import transactionsPreview from "../../../assets/transactions.png";

import { useAuth } from "../hooks/useAuth.js";

const highlights = [
  "Personal dashboard",
  "Category insights",
  "Expense limits",
  "Transaction history",
];

function AuthPage() {
  const {
    loginWithEmail: login,
    signupWithEmail: signup,
    error: authError,
    isLoading,
  } = useAuth();
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const getAuthErrorMessage = (error, currentMode) => {
    const code = error?.code;

    if (code) {
      switch (code) {
        case "auth/user-not-found":
          return "No account found for this email. Create one first.";
        case "auth/wrong-password":
          return "Incorrect password. Try again or reset your password.";
        case "auth/invalid-credential":
          return "Email or password is incorrect.";
        case "auth/invalid-email":
          return "Enter a valid email address.";
        case "auth/user-disabled":
          return "This account has been disabled. Contact support.";
        case "auth/too-many-requests":
          return "Too many attempts. Try again in a few minutes.";
        case "auth/email-already-in-use":
          return "An account already exists with this email.";
        case "auth/weak-password":
          return "Password is too weak. Use at least 8 characters.";
        default:
          return currentMode === "register"
            ? "Could not create the account. Please try again."
            : "Could not log in. Please try again.";
      }
    }

    return error?.response?.data?.message || "Something went wrong!";
  };

  const handleChange = (e) => {
    if (e.target.name === "password" && e.target.value.length < 8) {
      setMessage("Password must be at least 8 characters long");
    } else {
      setMessage("");
    }

    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    if (!authError) return;
    setMessage(getAuthErrorMessage(authError, mode));
  }, [authError, mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const trimmedForm = {
        ...form,
        email: form.email.trim(),
        password: form.password.trim(),
      };

      if (
        [trimmedForm.password, trimmedForm.email].some((field) => field === "")
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

      // console.log(trimmedForm.email, trimmedForm.password);

      if (mode === "register") {
        await signup(trimmedForm.email, trimmedForm.password);
        setMessage(
          "Account created successfully! Please verify your email before logging in.",
        );
      } else {
        await login(trimmedForm.email, trimmedForm.password);
        setMessage("");
      }
    } catch (error) {
      setMessage(getAuthErrorMessage(error, mode));
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
                <div className="flex h-10 w-10 shrink-0 items-end justify-center gap-1 rounded-(--r-md) bg-(--accent) p-2 text-white shadow-[0_12px_24px_rgba(22,163,74,0.24)]">
                  <span className="h-2.5 w-1.5 rounded-full bg-white/80" />
                  <span className="h-4 w-1.5 rounded-full bg-white" />
                  <span className="h-6 w-1.5 rounded-full bg-white/90" />
                </div>
                <p className="text-4xl font-bold text-(--text) max-[360px]:text-xl">
                  FinMo
                </p>
              </div>
            </div>

            <div className="grid items-start gap-8 min-[1280px]:grid-cols-[minmax(300px,0.9fr)_minmax(340px,1fr)] max-[1080px]:grid-cols-[minmax(0,1fr)_minmax(280px,420px)] max-[760px]:grid-cols-1 max-[640px]:gap-0">
              <div className="min-w-0">
                <h1 className="max-w-125 text-[clamp(1.8rem,3.5vw,2.2rem)] font-bold leading-[1.03] text-(--text) max-[640px]:text-[1.7rem] max-[420px]:text-[1.55rem]">
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

              <div className="relative min-w-0 max-[760px]:hidden min-[1280px]:min-h-112">
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
              Email
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

            <label className="mb-2 block text-sm font-bold text-(--text) max-[380px]:mb-1.5">
              Password
            </label>
            <div className="mb-5 flex w-full items-center rounded-(--r-md) border border-(--border) bg-(--bg) focus-within:border-(--border-focus) max-[380px]:mb-4">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Min 8 characters"
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
              disabled={isLoading}
              className="w-full rounded-(--r-md) bg-(--accent) px-4 py-3.5 font-bold text-white shadow-[0_14px_30px_rgba(22,163,74,0.24)] hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent) max-[380px]:py-3"
            >
              {isLoading
                ? "Signing in..."
                : isLogin
                  ? "Log in"
                  : "Create account"}
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
