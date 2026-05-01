function RoleSwitcher({ role, setRole }) {
  return (
    <div className="flex items-center gap-2 rounded-(--r-md) border border-(--border) bg-(--bg) px-2.5 py-1.5">
      <span className="text-sm font-medium text-(--text)">Mode</span>
      <select
        className="min-w-25 cursor-pointer rounded-(--r-sm) border border-(--border-strong) bg-(--surface) px-2 py-1 text-sm text-(--text) outline-none hover:border-(--border-focus) focus:border-(--border-focus) focus:bg-(--surface)"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="admin">Admin</option>
        <option value="user">User</option>
      </select>
    </div>
  );
}

export default RoleSwitcher;
