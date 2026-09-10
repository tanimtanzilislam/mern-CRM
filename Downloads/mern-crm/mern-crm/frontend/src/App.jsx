import { useEffect, useMemo, useState } from 'react';
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from './api';
import CustomerForm from './components/CustomerForm.jsx';
import CustomerList from './components/CustomerList.jsx';

export default function App() {
  const [customers, setCustomers] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const res = await getCustomers();
      setCustomers(res.data);
      setError('');
    } catch (err) {
      setError('Could not load customers. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleSubmit = async (data) => {
    try {
      if (editingCustomer) {
        await updateCustomer(editingCustomer._id, data);
        setEditingCustomer(null);
      } else {
        await createCustomer(data);
      }
      loadCustomers();
    } catch (err) {
      setError('Could not save customer.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this customer?')) return;
    try {
      await deleteCustomer(id);
      loadCustomers();
    } catch (err) {
      setError('Could not delete customer.');
    }
  };

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return customers;
    return customers.filter((customer) =>
      [customer.name, customer.email, customer.company, customer.status]
        .join(' ')
        .toLowerCase()
        .includes(query)
    );
  }, [customers, search]);

  const activeCustomers = customers.filter((customer) => customer.status === 'active').length;
  const leadCustomers = customers.filter((customer) => customer.status === 'lead').length;

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">M</div>
          <div>
            <p className="eyebrow">Customer workspace</p>
            <h1>Mini CRM</h1>
          </div>
        </div>
        <div className="topbar-meta">
          <span className="online-dot" /> Your workspace is ready
        </div>
      </header>

      <main>
        <section className="hero">
          <div>
            <p className="eyebrow">Overview</p>
            <h2>Good to see you.</h2>
            <p className="hero-copy">Keep your customer relationships moving forward.</p>
          </div>
          <div className="hero-decoration" aria-hidden="true">✦</div>
        </section>

        {error && <div className="error-banner" role="alert">{error}</div>}

        <section className="stats-grid" aria-label="Customer overview">
          <div className="stat-card">
            <span className="stat-icon purple">◎</span>
            <div><span className="stat-label">Total customers</span><strong>{customers.length}</strong></div>
          </div>
          <div className="stat-card">
            <span className="stat-icon green">↗</span>
            <div><span className="stat-label">Active accounts</span><strong>{activeCustomers}</strong></div>
          </div>
          <div className="stat-card">
            <span className="stat-icon amber">♧</span>
            <div><span className="stat-label">Open leads</span><strong>{leadCustomers}</strong></div>
          </div>
        </section>

        <div className="content-grid">
          <CustomerForm
            onSubmit={handleSubmit}
            editingCustomer={editingCustomer}
            onCancelEdit={() => setEditingCustomer(null)}
          />

          <section className="customers-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Directory</p>
                <h2>All customers <span>{loading ? '...' : customers.length}</span></h2>
              </div>
              <label className="search-box">
                <span aria-hidden="true">⌕</span>
                <input
                  type="search"
                  placeholder="Search customers..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  aria-label="Search customers"
                />
              </label>
            </div>
            {loading ? (
              <div className="loading-state"><span className="spinner" /> Loading customers...</div>
            ) : (
              <CustomerList
                customers={filteredCustomers}
                onEdit={setEditingCustomer}
                onDelete={handleDelete}
                hasSearch={Boolean(search)}
              />
            )}
          </section>
        </div>
      </main>
      <footer>Mini CRM <span>·</span> Built for better relationships</footer>
    </div>
  );
}
