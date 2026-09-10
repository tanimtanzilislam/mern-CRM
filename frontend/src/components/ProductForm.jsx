import { useEffect, useState } from 'react';

const emptyProduct = { name: '', sku: '', category: '', price: '', stock: '', status: 'active', description: '' };

export default function ProductForm({ onSubmit, editingProduct, onCancelEdit }) {
  const [form, setForm] = useState(emptyProduct);

  useEffect(() => {
    setForm(editingProduct ? { ...emptyProduct, ...editingProduct } : emptyProduct);
  }, [editingProduct]);

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ ...form, price: Number(form.price), stock: Number(form.stock) });
    setForm(emptyProduct);
  };

  return (
    <form className="customer-form" onSubmit={handleSubmit}>
      <div className="form-heading">
        <div><p className="eyebrow">{editingProduct ? 'Update inventory' : 'Catalog'}</p><h2>{editingProduct ? 'Edit product' : 'Add a product'}</h2></div>
        <span className="form-plus">+</span>
      </div>
      <div className="form-row form-row-wide"><label>Product name *</label><input name="name" value={form.name} onChange={handleChange} required /></div>
      <div className="form-row"><label>SKU *</label><input name="sku" value={form.sku} onChange={handleChange} required /></div>
      <div className="form-row"><label>Category</label><input name="category" value={form.category} onChange={handleChange} placeholder="e.g. Software" /></div>
      <div className="form-row"><label>Price *</label><input type="number" min="0" step="0.01" name="price" value={form.price} onChange={handleChange} required /></div>
      <div className="form-row"><label>Stock *</label><input type="number" min="0" name="stock" value={form.stock} onChange={handleChange} required /></div>
      <div className="form-row"><label>Status</label><select name="status" value={form.status} onChange={handleChange}><option value="active">Active</option><option value="draft">Draft</option><option value="archived">Archived</option></select></div>
      <div className="form-row form-row-wide"><label>Description</label><textarea name="description" value={form.description} onChange={handleChange} rows={3} /></div>
      <div className="form-actions"><button type="submit">{editingProduct ? 'Save changes' : 'Add product'} <span>→</span></button>{editingProduct && <button type="button" className="secondary" onClick={onCancelEdit}>Cancel</button>}</div>
    </form>
  );
}
