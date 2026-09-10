import { useState } from 'react';

export default function Login({ onLogin, onRegister }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [firstUser, setFirstUser] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    try {
      setError('');
      await onLogin(form, firstUser);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to sign in');
    }
  };

  return <div className="login-shell"><div className="login-card"><div className="brand-mark">M</div><p className="eyebrow">Secure workspace</p><h1>{firstUser ? 'Create admin account' : 'Welcome back'}</h1><p className="login-copy">{firstUser ? 'Create the first administrator to start your CRM.' : 'Sign in to manage your customer relationships.'}</p>{error && <div className="error-banner">{error}</div>}<form onSubmit={submit}><div className="form-row"><label>Email</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div><div className="form-row"><label>Password</label><input type="password" minLength="8" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></div><button className="login-button">{firstUser ? 'Create admin' : 'Sign in'} <span>→</span></button></form><button className="link-button" onClick={() => { setFirstUser(!firstUser); setError(''); }}>{firstUser ? 'Already have an account? Sign in' : 'First time here? Create admin account'}</button></div></div>;
}
