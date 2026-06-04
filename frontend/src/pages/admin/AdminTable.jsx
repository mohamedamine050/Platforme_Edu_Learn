const AdminTable = ({ columns, rows, onEdit, onDelete, emptyLabel = "Aucun élément." }) => {
  if (!rows || rows.length === 0) {
    return <p className="adminEmpty">{emptyLabel}</p>;
  }

  return (
    <div className="adminTableWrap">
      <table className="adminTable">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={col.className}>{col.label}</th>
            ))}
            {(onEdit || onDelete) && <th className="adminTableActions">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {columns.map((col) => (
                <td key={col.key} className={col.className}>{col.render ? col.render(row) : row[col.key]}</td>
              ))}
              {(onEdit || onDelete) && (
                <td className="adminTableActions">
                  {onEdit && (
                    <button className="adminBtn adminBtnGhost" type="button" onClick={() => onEdit(row)}>
                      Éditer
                    </button>
                  )}
                  {onDelete && (
                    <button className="adminBtn adminBtnDanger" type="button" onClick={() => onDelete(row)}>
                      Supprimer
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;
