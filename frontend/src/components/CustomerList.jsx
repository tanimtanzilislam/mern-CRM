export default function CustomerList({ customers, onEdit, onDelete, hasSearch }) {
  if (!customers.length) {
    return <div className="empty-state"><span>⌁</span><strong>{hasSearch ? 'No matches found' : 'Your directory is empty'}</strong><p>{hasSearch ? 'Try a different search term.' : 'Add your first customer to get started.'}</p></div>;
  }

  return (
    <table className="customer-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Company</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {customers.map((c) => (
          <tr key={c._id}>
            <td><div className="customer-name"><span className="avatar">{c.name.charAt(0).toUpperCase()}</span><strong>{c.name}</strong></div></td>
            <td>{c.email}</td>
            <td>{c.phone}</td>
            <td>{c.company}</td>
            <td>
              <span className={`badge badge-${c.status}`}>{c.status}</span>
            </td>
            <td className="actions">
              <button className="table-action" onClick={() => onEdit(c)} aria-label={`Edit ${c.name}`}>Edit</button>
              <button className="table-action danger" onClick={() => onDelete(c._id)} aria-label={`Delete ${c.name}`}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
