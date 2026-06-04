import { useEffect, useState } from "react";
import { getClasses, createClass, updateClass, deleteClass } from "../../service/api";
import { useListQuery } from "../../hooks/useListQuery";
import AdminTable from "./AdminTable";
import AdminFormModal from "./AdminFormModal";
import AdminPagination from "./AdminPagination";

const PAGE_SIZE = 10;

const LEVEL_OPTIONS = [
  { value: "COLLEGE", label: "Collège" },
  { value: "LYCEE", label: "Lycée" },
  { value: "UNIV", label: "Université" },
];

const FIELDS = [
  { name: "title", label: "Titre", required: true },
  { name: "level", label: "Niveau", type: "select", options: LEVEL_OPTIONS, required: true },
  { name: "price", label: "Prix de base (DT) — pour une classe sans sections", type: "number", step: "0.01", min: "0", placeholder: "0.00" },
  { name: "sections", label: "Sections (nom + prix)", type: "sectionprices" },
];

const COLUMNS = [
  { key: "title", label: "Titre" },
  { key: "level", label: "Niveau" },
  { key: "price", label: "Prix", className: "adminNowrap", render: (row) => (row.price != null ? `${Number(row.price).toFixed(2)} DT` : "—") },
  {
    key: "sections",
    label: "Sections",
    render: (row) =>
      row.sections?.length
        ? row.sections.map((s) => `${s.name} (${Number(s.price).toFixed(2)} DT)`).join(", ")
        : "—",
  },
];

// Nettoie les lignes de section du formulaire : nom non vide, prix -> nombre (ou null).
const cleanSections = (rows) => {
  if (!Array.isArray(rows)) return [];
  return rows
    .filter((r) => r && r.name && r.name.trim())
    .map((r) => ({
      name: r.name.trim(),
      price: r.price === "" || r.price == null ? null : Number(r.price),
    }));
};

const AdminClasses = () => {
  const { get, page, setParams } = useListQuery();
  const search = get("search");
  const level = get("level");

  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Champ de recherche local (réactif), poussé dans l'URL avec un debounce.
  const [searchInput, setSearchInput] = useState(search);
  useEffect(() => {
    // Synchronise le champ avec l'URL (retour/avance navigateur).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchInput(search);
  }, [search]);
  useEffect(() => {
    if (searchInput === search) return;
    const timer = setTimeout(() => setParams({ search: searchInput }, { resetPage: true, replace: true }), 300);
    return () => clearTimeout(timer);
  }, [searchInput, search, setParams]);

  // reloadKey : incrémenté par les handlers (création/suppression) pour reforcer un fetch.
  const [reloadKey, setReloadKey] = useState(0);
  const reload = () => setReloadKey((k) => k + 1);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await getClasses({ search, level, page: page - 1, size: PAGE_SIZE });
        if (active) { setItems(res.content); setTotalPages(res.totalPages); setError(""); }
      } catch (err) {
        if (active) setError(err.message || "Chargement impossible.");
      }
    })();
    return () => { active = false; };
  }, [search, level, page, reloadKey]);

  const openCreate = () => { setEditing(null); setFormError(""); setModalOpen(true); };
  const openEdit = (row) => {
    // Les sections (objets {id, name, price}) alimentent directement l'éditeur nom+prix.
    setEditing({ ...row, sections: (row.sections || []).map((s) => ({ name: s.name, price: s.price })) });
    setFormError("");
    setModalOpen(true);
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    setFormError("");
    try {
      const payload = {
        ...values,
        price: values.price === "" || values.price == null ? null : Number(values.price),
        sections: cleanSections(values.sections),
      };
      if (editing) {
        await updateClass(editing.id, payload);
      } else {
        await createClass(payload);
      }
      setModalOpen(false);
      reload();
    } catch (err) {
      setFormError(err.message || "Enregistrement impossible.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Supprimer la classe « ${row.title} » ?`)) return;
    try {
      await deleteClass(row.id);
      // Si on supprime le dernier élément d'une page > 1, on recule d'une page.
      if (items.length === 1 && page > 1) setParams({ page: page - 1 });
      else reload();
    } catch (err) {
      setError(err.message || "Suppression impossible.");
    }
  };

  return (
    <div className="adminPage">
      <header className="adminPageHeader">
        <h1>Classes</h1>
        <button className="adminBtn adminBtnPrimary" type="button" onClick={openCreate}>
          + Nouvelle classe
        </button>
      </header>

      <div className="adminFilters">
        <label className="adminField">
          <span>Recherche</span>
          <input
            className="adminInput"
            type="text"
            placeholder="Titre de la classe…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </label>
        <label className="adminField">
          <span>Niveau</span>
          <select
            className="adminInput"
            value={level}
            onChange={(e) => setParams({ level: e.target.value }, { resetPage: true })}
          >
            <option value="">Tous</option>
            {LEVEL_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </label>
      </div>

      {error && <p className="adminError">{error}</p>}

      <AdminTable
        columns={COLUMNS}
        rows={items}
        onEdit={openEdit}
        onDelete={handleDelete}
        emptyLabel="Aucune classe."
      />

      <AdminPagination page={page - 1} totalPages={totalPages} onChange={(p) => setParams({ page: p + 1 })} />

      {modalOpen && (
        <AdminFormModal
          title={editing ? "Modifier la classe" : "Nouvelle classe"}
          fields={FIELDS}
          initialValues={editing}
          onSubmit={handleSubmit}
          onClose={() => setModalOpen(false)}
          submitting={submitting}
          error={formError}
        />
      )}
    </div>
  );
};

export default AdminClasses;
