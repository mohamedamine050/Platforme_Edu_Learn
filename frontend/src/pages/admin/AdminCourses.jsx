import { useEffect, useMemo, useState } from "react";
import { getClasses, getCoursesByClass, createCourse, updateCourse, deleteCourse } from "../../service/api";
import { useListQuery } from "../../hooks/useListQuery";
import AdminTable from "./AdminTable";
import AdminFormModal from "./AdminFormModal";
import AdminPagination from "./AdminPagination";

const PAGE_SIZE = 10;

const COLUMNS = [
  { key: "title", label: "Titre" },
  { key: "description", label: "Description" },
  { key: "sections", label: "Sections", render: (row) => (row.sections?.length ? row.sections.join(", ") : "Toutes") },
];

const AdminCourses = () => {
  const { get, page, setParams } = useListQuery();
  const classId = get("classId");
  const search = get("search");

  const [classes, setClasses] = useState([]);
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [searchInput, setSearchInput] = useState(search);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchInput(search);
  }, [search]);
  useEffect(() => {
    if (searchInput === search) return;
    const timer = setTimeout(() => setParams({ search: searchInput }, { resetPage: true, replace: true }), 300);
    return () => clearTimeout(timer);
  }, [searchInput, search, setParams]);

  useEffect(() => {
    getClasses({ size: 1000 })
      .then((res) => setClasses(res.content))
      .catch((err) => setError(err.message || "Chargement des classes impossible."));
  }, []);

  const [reloadKey, setReloadKey] = useState(0);
  const reload = () => setReloadKey((k) => k + 1);

  // Pas de classe sélectionnée : on ne charge rien (la liste est masquée au rendu).
  useEffect(() => {
    if (!classId) return;
    let active = true;
    (async () => {
      try {
        const res = await getCoursesByClass(classId, { search, page: page - 1, size: PAGE_SIZE });
        if (active) { setItems(res.content); setTotalPages(res.totalPages); setError(""); }
      } catch (err) {
        if (active) setError(err.message || "Chargement des cours impossible.");
      }
    })();
    return () => { active = false; };
  }, [classId, search, page, reloadKey]);

  // Champs : on ajoute le multi-select "sections" si la classe choisie en a.
  const fields = useMemo(() => {
    const selectedClass = classes.find((c) => String(c.id) === String(classId));
    const sectionOptions = (selectedClass?.sections ?? []).map((s) => ({ value: s.name, label: s.name }));
    const base = [
      { name: "title", label: "Titre", required: true },
      { name: "description", label: "Description", type: "textarea" },
    ];
    if (sectionOptions.length > 0) {
      base.push({
        name: "sections",
        label: "Réservé aux sections (aucune cochée = commun à toutes)",
        type: "multiselect",
        options: sectionOptions,
      });
    }
    return base;
  }, [classes, classId]);

  const openCreate = () => { setEditing(null); setFormError(""); setModalOpen(true); };
  const openEdit = (row) => { setEditing(row); setFormError(""); setModalOpen(true); };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    setFormError("");
    try {
      if (editing) {
        await updateCourse(editing.id, values);
      } else {
        await createCourse(classId, values);
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
    if (!window.confirm(`Supprimer le cours « ${row.title} » ?`)) return;
    try {
      await deleteCourse(row.id);
      if (items.length === 1 && page > 1) setParams({ page: page - 1 });
      else reload();
    } catch (err) {
      setError(err.message || "Suppression impossible.");
    }
  };

  return (
    <div className="adminPage">
      <header className="adminPageHeader">
        <h1>Cours</h1>
        <button className="adminBtn adminBtnPrimary" type="button" onClick={openCreate} disabled={!classId}>
          + Nouveau cours
        </button>
      </header>

      <div className="adminFilters">
        <label className="adminField">
          <span>Classe</span>
          <select
            className="adminInput"
            value={classId}
            onChange={(e) => setParams({ classId: e.target.value }, { resetPage: true })}
          >
            <option value="">— Sélectionner une classe —</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>{c.title} ({c.level})</option>
            ))}
          </select>
        </label>
        <label className="adminField">
          <span>Recherche</span>
          <input
            className="adminInput"
            type="text"
            placeholder="Titre du cours…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            disabled={!classId}
          />
        </label>
      </div>

      {error && <p className="adminError">{error}</p>}

      {classId ? (
        <>
          <AdminTable
            columns={COLUMNS}
            rows={items}
            onEdit={openEdit}
            onDelete={handleDelete}
            emptyLabel="Aucun cours pour cette classe."
          />
          <AdminPagination page={page - 1} totalPages={totalPages} onChange={(p) => setParams({ page: p + 1 })} />
        </>
      ) : (
        <p className="adminEmpty">Sélectionnez une classe pour voir ses cours.</p>
      )}

      {modalOpen && (
        <AdminFormModal
          title={editing ? "Modifier le cours" : "Nouveau cours"}
          fields={fields}
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

export default AdminCourses;
