// Pagination générique (côté étudiant). `page` est 0-based.
const Pagination = ({ page, totalPages, onChange }) => {
  if (!totalPages || totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button
        type="button"
        className="paginationBtn"
        disabled={page <= 0}
        onClick={() => onChange(page - 1)}
      >
        Précédent
      </button>
      <span className="paginationInfo">Page {page + 1} / {totalPages}</span>
      <button
        type="button"
        className="paginationBtn"
        disabled={page >= totalPages - 1}
        onClick={() => onChange(page + 1)}
      >
        Suivant
      </button>
    </div>
  );
};

export default Pagination;
