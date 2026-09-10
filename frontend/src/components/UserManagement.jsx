import { useEffect, useState } from 'react';
import { createUser, getUsers, updateUserRole } from '../api';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'staff' });
  const [error, setError] = useState('');

  const load = async () => setUsers((await getUsers()).data);
  useEffect(() => { load().catch((err) => setError(err.response?.data?.message || 'Could not load users')); }, []);
  const submit = async (event) => {
    event.preventDefault();
    try { await createUser(form); setForm({ name: '', email: '', password: '', role: 'staff' }); await load(); } catch (err) { setError(err.response?.data?.message || 'Could not create user'); }
  };
  const changeRole = async (id, role) => { await updateUserRole(id, role); await load(); };

  return <section className="users-panel"><div className="section-heading"><div><p className="eyebrow">Administration</p><h2>User management <span>{users.length}</span></h2></div></div>{error && <div className="error-banner">{error}</div>}<form className="user-form" onSubmit={submit}><input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /><input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /><input type="password" placeholder="Temporary password" minLength="8" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /><select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}><option value="admin">Admin</option><option value="sales_manager">Sales Manager</option><option value="staff">Staff</option></select><button>Add user</button></form><table className="customer-table"><thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead><tbody>{users.map((user) => <tr key={user._id}><td><strong>{user.name}</strong></td><td>{user.email}</td><td><select value={user.role} onChange={(e) => changeRole(user._id, e.target.value)}><option value="admin">Admin</option><option value="sales_manager">Sales Manager</option><option value="staff">Staff</option></select></td></tr>)}</tbody></table></section>;
}
