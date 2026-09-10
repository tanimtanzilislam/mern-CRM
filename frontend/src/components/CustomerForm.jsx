import { useEffect, useState } from 'react';

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  company: '',
  status: 'lead',
  notes: '',
};

export default function CustomerForm({ onSubmit, editingCustomer, onCancelEdit }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (editingCustomer) {
      setForm({
        name: editingCustomer.name || '',
        email: editingCustomer.email || '',
        phone: editingCustomer.phone || '',
        company: editingCustomer.company || '',
        status: editingCustomer.status || 'lead',
        notes: editingCustomer.notes || '',
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingCustomer]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    onSubmit(form);
    setForm(emptyForm);
  };

  return (
    <form className="customer-form" onSubmit={handleSubmit}>
      <div className="form-heading">
        <div>
          <p className="eyebrow">{editingCustomer ? 'Update details' : 'New relationship'}</p>
          <h2>{editingCustomer ? 'Edit customer' : 'Add a customer'}</h2>
        </div>
        <span className="form-plus">+</span>
      </div>

      <div className="form-row form-row-wide">
        <label>Name *</label>
        <input name="name" value={form.name} onChange={handleChange} required />
      </div>

      <div className="form-row form-row-wide">
        <label>Email *</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-row">
        <label>Phone</label>
        <input name="phone" value={form.phone} onChange={handleChange} />
      </div>

      <div className="form-row">
        <label>Company</label>
        <input name="company" value={form.company} onChange={handleChange} />
      </div>

      <div className="form-row">
        <label>Status</label>
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="lead">Lead</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="form-row form-row-wide">
        <label>Notes</label>
        <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} />
      </div>

      <div className="form-actions">
        <button type="submit">{editingCustomer ? 'Save changes' : 'Add customer'} <span>→</span></button>
        {editingCustomer && (
          <button type="button" className="secondary" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
