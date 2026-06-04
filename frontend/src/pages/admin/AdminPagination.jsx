// Contrôle de pagination simple (Précédent / Suivant + indicateur de page).
const AdminPagination = ({ page, totalPages, onChange }) => {
  if (!totalPages || totalPages <= 1) return null;

  return (
    <div className="adminPagination">
      <button
        type="button"
        className="adminBtn adminBtnGhost"
        disabled={page <= 0}
        onClick={() => onChange(page - 1)}
      >
        Précédent
      </button>
      <span className="adminPaginationInfo">Page {page + 1} / {totalPages}</span>
      <button
        type="button"
        className="adminBtn adminBtnGhost"
        disabled={page >= totalPages - 1}
        onClick={() => onChange(page + 1)}
      >
        Suivant
      </button>
    </div>
  );
};

export default AdminPagination;
