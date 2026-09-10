export default function ProductList({ products, onEdit, onDelete, hasSearch }) {
  if (!products.length) return <div className="empty-state"><span>⌁</span><strong>{hasSearch ? 'No products found' : 'Your catalog is empty'}</strong><p>{hasSearch ? 'Try a different search term.' : 'Add your first product to get started.'}</p></div>;

  return (
    <table className="customer-table">
      <thead><tr><th>Product</th><th>SKU</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>{products.map((product) => (
        <tr key={product._id}>
          <td><div className="customer-name"><span className="avatar product-avatar">{product.name.charAt(0).toUpperCase()}</span><strong>{product.name}</strong></div></td>
          <td>{product.sku}</td><td>{product.category || '—'}</td><td>${product.price.toFixed(2)}</td>
          <td><span className={`stock ${product.stock < 10 ? 'low-stock' : ''}`}>{product.stock} units</span></td>
          <td><span className={`badge badge-${product.status}`}>{product.status}</span></td>
          <td className="actions"><button className="table-action" onClick={() => onEdit(product)}>Edit</button><button className="table-action danger" onClick={() => onDelete(product._id)}>Delete</button></td>
        </tr>
      ))}</tbody>
    </table>
  );
}
