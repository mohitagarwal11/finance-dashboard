import "./RoleSwitcher.css";

function RoleSwitcher({ role, setRole }) {
  return (
    <div className="role-switcher">
      <span className="role-switcher__label">Mode</span>
      <select
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
