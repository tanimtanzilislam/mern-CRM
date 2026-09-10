import { useEffect, useMemo, useState } from 'react';
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from './api';
import CustomerForm from './components/CustomerForm.jsx';
import CustomerList from './components/CustomerList.jsx';
import ProductForm from './components/ProductForm.jsx';
import ProductList from './components/ProductList.jsx';

export default function App() {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [view, setView] = useState('customers');
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const res = await getCustomers();
      if (!Array.isArray(res.data)) {
        throw new Error('Unexpected customer response');
      }
      setCustomers(res.data);
      setError('');
    } catch (err) {
      const message = err.response?.data?.message;
      setError(message ? `Could not load customers: ${message}` : 'Could not load customers. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await getProducts();
      if (!Array.isArray(res.data)) throw new Error('Unexpected product response');
      setProducts(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load products.');
    }
  };

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

  const handleProductSubmit = async (data) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id, data);
        setEditingProduct(null);
      } else {
        await createProduct(data);
      }
      await loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save product.');
    }
  };

  const handleProductDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      await loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete product.');
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
  const activeProducts = products.filter((product) => product.status === 'active').length;
  const lowStockProducts = products.filter((product) => product.stock < 10).length;
  const filteredProducts = useMemo(() => {
    const query = productSearch.trim().toLowerCase();
    if (!query) return products;
    return products.filter((product) => [product.name, product.sku, product.category, product.status].join(' ').toLowerCase().includes(query));
  }, [products, productSearch]);

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

        <section className="stats-grid" aria-label={`${view} overview`}>
          <div className="stat-card">
            <span className="stat-icon purple">◎</span>
            <div><span className="stat-label">{view === 'customers' ? 'Total customers' : 'Total products'}</span><strong>{view === 'customers' ? customers.length : products.length}</strong></div>
          </div>
          <div className="stat-card">
            <span className="stat-icon green">↗</span>
            <div><span className="stat-label">{view === 'customers' ? 'Active accounts' : 'Active products'}</span><strong>{view === 'customers' ? activeCustomers : activeProducts}</strong></div>
          </div>
          <div className="stat-card">
            <span className="stat-icon amber">♧</span>
            <div><span className="stat-label">{view === 'customers' ? 'Open leads' : 'Low stock items'}</span><strong>{view === 'customers' ? leadCustomers : lowStockProducts}</strong></div>
          </div>
        </section>

        <div className="content-grid">
          <aside className="sidebar">
            <nav className="view-switcher" aria-label="Management sections">
              <button className={view === 'customers' ? 'selected' : ''} onClick={() => setView('customers')}>◎ <span>Customers</span></button>
              <button className={view === 'products' ? 'selected' : ''} onClick={() => setView('products')}>▦ <span>Products</span></button>
            </nav>
            {view === 'customers' ? <CustomerForm onSubmit={handleSubmit} editingCustomer={editingCustomer} onCancelEdit={() => setEditingCustomer(null)} /> : <ProductForm onSubmit={handleProductSubmit} editingProduct={editingProduct} onCancelEdit={() => setEditingProduct(null)} />}
          </aside>

          <section className="customers-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">{view === 'customers' ? 'Directory' : 'Inventory'}</p>
                <h2>{view === 'customers' ? 'All customers' : 'Product catalog'} <span>{loading ? '...' : view === 'customers' ? customers.length : products.length}</span></h2>
              </div>
              <label className="search-box">
                <span aria-hidden="true">⌕</span>
                <input
                  type="search"
                  placeholder={`Search ${view}...`}
                  value={view === 'customers' ? search : productSearch}
                  onChange={(event) => view === 'customers' ? setSearch(event.target.value) : setProductSearch(event.target.value)}
                  aria-label={`Search ${view}`}
                />
              </label>
            </div>
            {loading ? (
              <div className="loading-state"><span className="spinner" /> Loading customers...</div>
            ) : view === 'customers' ? (
              <CustomerList
                customers={filteredCustomers}
                onEdit={setEditingCustomer}
                onDelete={handleDelete}
                hasSearch={Boolean(search)}
              />
            ) : (
              <ProductList products={filteredProducts} onEdit={setEditingProduct} onDelete={handleProductDelete} hasSearch={Boolean(productSearch)} />
            )}
          </section>
        </div>
      </main>
      <footer>Mini CRM <span>·</span> Built for better relationships</footer>
    </div>
  );
}
