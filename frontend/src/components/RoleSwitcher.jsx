function RoleSwitcher({ role, setRole }) {
  return (
    <select
      value={role}
      onChange={(e) => setRole(e.target.value)}>
      <option value="admin">Admin</option>
      <option value="user">User</option>
    </select>
  );
}

export default RoleSwitcher;
