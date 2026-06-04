import { useEffect, useState } from "react";
import {
  getClasses,
  getCoursesByClass,
  getChaptersByCourse,
  getResourcesByChapter,
  createResource,
  updateResource,
  deleteResource,
} from "../../service/api";
import { useListQuery } from "../../hooks/useListQuery";
import AdminTable from "./AdminTable";
import AdminFormModal from "./AdminFormModal";
import AdminPagination from "./AdminPagination";

const PAGE_SIZE = 10;

const FIELDS = [
  { name: "name", label: "Nom du document", required: true, placeholder: "Cours complet, Exercices…" },
  { name: "fileUrl", label: "Lien du document", required: true, placeholder: "https://drive.google.com/file/d/.../view" },
];

const COLUMNS = [
  { key: "name", label: "Nom" },
  {
    key: "fileUrl",
    label: "Lien",
    render: (row) => (
      <a href={row.fileUrl} target="_blank" rel="noreferrer">{row.fileUrl}</a>
    ),
  },
];

const AdminResources = () => {
  const { get, page, setParams } = useListQuery();
  const classId = get("classId");
  const courseId = get("courseId");
  const chapterId = get("chapterId");
  const search = get("search");

  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [chapters, setChapters] = useState([]);
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

  useEffect(() => {
    if (!classId) return;
    getCoursesByClass(classId, { size: 1000 })
      .then((res) => setCourses(res.content))
      .catch((err) => setError(err.message || "Chargement des cours impossible."));
  }, [classId]);

  useEffect(() => {
    if (!courseId) return;
    getChaptersByCourse(courseId, { size: 1000 })
      .then((res) => setChapters(res.content))
      .catch((err) => setError(err.message || "Chargement des chapitres impossible."));
  }, [courseId]);

  const [reloadKey, setReloadKey] = useState(0);
  const reload = () => setReloadKey((k) => k + 1);

  useEffect(() => {
    if (!chapterId) return;
    let active = true;
    (async () => {
      try {
        const res = await getResourcesByChapter(chapterId, { search, page: page - 1, size: PAGE_SIZE });
        if (active) { setItems(res.content); setTotalPages(res.totalPages); setError(""); }
      } catch (err) {
        if (active) setError(err.message || "Chargement des ressources impossible.");
      }
    })();
    return () => { active = false; };
  }, [chapterId, search, page, reloadKey]);

  const openCreate = () => { setEditing(null); setFormError(""); setModalOpen(true); };
  const openEdit = (row) => { setEditing(row); setFormError(""); setModalOpen(true); };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    setFormError("");
    try {
      if (editing) {
        await updateResource(editing.id, values);
      } else {
        await createResource(chapterId, values);
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
    if (!window.confirm(`Supprimer le document « ${row.name} » ?`)) return;
    try {
      await deleteResource(row.id);
      if (items.length === 1 && page > 1) setParams({ page: page - 1 });
      else reload();
    } catch (err) {
      setError(err.message || "Suppression impossible.");
    }
  };

  return (
    <div className="adminPage">
      <header className="adminPageHeader">
        <h1>Documents</h1>
        <button className="adminBtn adminBtnPrimary" type="button" onClick={openCreate} disabled={!chapterId}>
          + Nouveau document
        </button>
      </header>

      <div className="adminFilters">
        <label className="adminField">
          <span>Classe</span>
          <select
            className="adminInput"
            value={classId}
            onChange={(e) => setParams({ classId: e.target.value, courseId: null, chapterId: null }, { resetPage: true })}
          >
            <option value="">— Classe —</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>{c.title} ({c.level})</option>
            ))}
          </select>
        </label>

        <label className="adminField">
          <span>Cours</span>
          <select
            className="adminInput"
            value={courseId}
            onChange={(e) => setParams({ courseId: e.target.value, chapterId: null }, { resetPage: true })}
            disabled={!classId}
          >
            <option value="">— Cours —</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </label>

        <label className="adminField">
          <span>Chapitre</span>
          <select
            className="adminInput"
            value={chapterId}
            onChange={(e) => setParams({ chapterId: e.target.value }, { resetPage: true })}
            disabled={!courseId}
          >
            <option value="">— Chapitre —</option>
            {chapters.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </label>

        <label className="adminField">
          <span>Recherche</span>
          <input
            className="adminInput"
            type="text"
            placeholder="Nom du document…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            disabled={!chapterId}
          />
        </label>
      </div>

      {error && <p className="adminError">{error}</p>}

      {chapterId ? (
        <>
          <AdminTable
            columns={COLUMNS}
            rows={items}
            onEdit={openEdit}
            onDelete={handleDelete}
            emptyLabel="Aucun document pour ce chapitre."
          />
          <AdminPagination page={page - 1} totalPages={totalPages} onChange={(p) => setParams({ page: p + 1 })} />
        </>
      ) : (
        <p className="adminEmpty">Sélectionnez une classe, un cours puis un chapitre.</p>
      )}

      {modalOpen && (
        <AdminFormModal
          title={editing ? "Modifier le document" : "Nouveau document"}
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

export default AdminResources;
