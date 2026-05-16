import { useState } from "react";
import { loginUser, registerUser } from "../api/auth";

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

  return (
    <div className="flex min-h-dvh items-center justify-center bg-(--bg) px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-(--r-lg) border border-(--border-strong) bg-(--surface) p-6"
      >
        <h1 className="mb-5 text-2xl font-semibold text-(--text)">
          {mode === "login" ? "Login" : "Register"}
        </h1>

        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="mb-3 w-full rounded-(--r-md) border border-(--border) bg-(--bg) px-3 py-2"
        />

        {mode === "register" && (
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="mb-3 w-full rounded-(--r-md) border border-(--border) bg-(--bg) px-3 py-2"
          />
        )}

        <div className="mb-4 flex w-full items-center rounded-(--r-md) border border-(--border) bg-(--bg) focus-within:border-(--border-focus)">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="min-w-0 flex-1 bg-transparent px-3 py-2 outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="px-3 py-2 text-sm font-semibold text-(--accent)"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button
          type="submit"
          className="w-full rounded-(--r-md) bg-(--accent) px-4 py-2 font-semibold text-white"
          onClick={handleSubmit}
        >
          {mode === "login" ? "Login" : "Create account"}
        </button>

        {message && <p className="mt-3 text-sm text-(--muted)">{message}</p>}

        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="mt-4 text-sm font-semibold text-(--accent)"
        >
          {mode === "login"
            ? "Need an account? Register"
            : "Already have an account? Login"}
        </button>
      </form>
    </div>
  );
}

export default AuthPage;
