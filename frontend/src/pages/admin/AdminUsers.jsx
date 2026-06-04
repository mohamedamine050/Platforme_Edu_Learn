import { useEffect, useMemo, useState } from "react";
import { getUsers, createUser, updateUser, deleteUser, getClasses, setUserAccess } from "../../service/api";
import { useListQuery } from "../../hooks/useListQuery";
import AdminTable from "./AdminTable";
import AdminFormModal from "./AdminFormModal";
import AdminPagination from "./AdminPagination";

const PAGE_SIZE = 10;

const ROLE_OPTIONS = [
  { value: "STUDENT", label: "Étudiant" },
  { value: "ADMIN", label: "Administrateur" },
];

const LEVEL_OPTIONS = [
  { value: "COLLEGE", label: "Collège" },
  { value: "LYCEE", label: "Lycée" },
  { value: "UNIV", label: "Université" },
];

const GENDER_OPTIONS = [
  { value: "HOMME", label: "Homme" },
  { value: "FEMME", label: "Femme" },
];

const ACTIVE_OPTIONS = [
  { value: "true", label: "Actif" },
  { value: "false", label: "Inactif" },
];

const COLUMNS = [
  { key: "firstName", label: "Prénom" },
  { key: "lastName", label: "Nom" },
  { key: "email", label: "Email" },
  { key: "role", label: "Rôle" },
  { key: "isActive", label: "Statut", render: (row) => (row.isActive ? "Actif" : "Inactif") },
  { key: "classTitle", label: "Classe", render: (row) => row.classTitle || "—" },
  { key: "section", label: "Section", render: (row) => row.section || "—" },
];

const toFormValues = (user) => ({
  firstName: user.firstName ?? "",
  lastName: user.lastName ?? "",
  email: user.email ?? "",
  password: "",
  phoneNumber: user.phoneNumber ?? "",
  isActive: String(user.isActive ?? true),
  role: user.role ?? "STUDENT",
  level: user.level ?? "",
  section: user.section ?? "",
  establishment: user.establishment ?? "",
  region: user.region ?? "",
  gender: user.gender ?? "",
  dateOfBirth: user.dateOfBirth ?? "",
  classId: user.classId != null ? String(user.classId) : "",
});

const AdminUsers = () => {
  const { get, page, setParams } = useListQuery();
  const search = get("search");
  const roleFilter = get("role");

  const [items, setItems] = useState([]);
  const [classes, setClasses] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Champ de recherche local, poussé dans l'URL avec un debounce.
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

  const [reloadKey, setReloadKey] = useState(0);
  const reload = () => setReloadKey((k) => k + 1);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await getUsers({ search, role: roleFilter, page: page - 1, size: PAGE_SIZE });
        if (active) { setItems(res.content); setTotalPages(res.totalPages); setError(""); }
      } catch (err) {
        if (active) setError(err.message || "Chargement impossible.");
      }
    })();
    return () => { active = false; };
  }, [search, roleFilter, page, reloadKey]);

  // Toutes les classes pour le menu déroulant (pas de pagination ici).
  useEffect(() => {
    getClasses({ size: 1000 }).then((res) => setClasses(res.content)).catch(() => {});
  }, []);

  const buildFields = useMemo(() => (values) => {
    const base = [
      { name: "firstName", label: "Prénom", required: true },
      { name: "lastName", label: "Nom", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "password", label: editing ? "Mot de passe (nouveau)" : "Mot de passe", type: "password", required: true },
      { name: "phoneNumber", label: "Téléphone", type: "tel" },
      { name: "isActive", label: "Statut", type: "select", options: ACTIVE_OPTIONS, required: true },
      { name: "role", label: "Rôle", type: "select", options: ROLE_OPTIONS, required: true },
    ];

    // Champs spécifiques aux étudiants : masqués pour un administrateur.
    if (values.role !== "ADMIN") {
      base.push(
        { name: "level", label: "Niveau", type: "select", options: LEVEL_OPTIONS, required: true },
        { name: "establishment", label: "Établissement", required: true, placeholder: "Lycée Pilote…" },
        { name: "region", label: "Région", required: true, placeholder: "Tunis, Sfax…" },
        { name: "gender", label: "Genre", type: "select", options: GENDER_OPTIONS, required: true },
        { name: "dateOfBirth", label: "Date de naissance", type: "date", required: true },
        {
          name: "classId",
          label: "Classe",
          type: "select",
          required: true,
          options: classes.map((c) => ({ value: String(c.id), label: `${c.title} (${c.level})` })),
        },
      );

      // Section : proposée seulement si la classe choisie en possède.
      const selectedClass = classes.find((c) => String(c.id) === String(values.classId));
      const sectionOptions = selectedClass?.sections ?? [];
      if (sectionOptions.length > 0) {
        base.push({
          name: "section",
          label: "Section",
          type: "select",
          required: true,
          options: sectionOptions.map((s) => ({ value: s.name, label: s.name })),
        });
      }
    }
    return base;
  }, [classes, editing]);

  const openCreate = () => { setEditing(null); setFormError(""); setModalOpen(true); };
  const openEdit = (row) => { setEditing(row); setFormError(""); setModalOpen(true); };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    setFormError("");
    try {
      const isAdmin = values.role === "ADMIN";
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        role: values.role,
        isActive: values.isActive === "true",
        phoneNumber: values.phoneNumber.trim() === "" ? null : values.phoneNumber.trim(),
        level: isAdmin ? null : values.level,
        section: isAdmin ? null : (values.section || null),
        establishment: isAdmin ? null : values.establishment,
        region: isAdmin ? null : values.region,
        gender: isAdmin ? null : values.gender,
        dateOfBirth: isAdmin ? null : values.dateOfBirth,
        classId: isAdmin || values.classId === "" ? null : values.classId,
      };
      if (editing) {
        await updateUser(editing.id, payload);
      } else {
        await createUser(payload);
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
    if (!window.confirm(`Supprimer l'utilisateur « ${row.email} » ?`)) return;
    try {
      await deleteUser(row.id);
      if (items.length === 1 && page > 1) setParams({ page: page - 1 });
      else reload();
    } catch (err) {
      setError(err.message || "Suppression impossible.");
    }
  };

  // Accorde / révoque l'accès au contenu (vidéos, documents) pour un étudiant.
  const handleToggleAccess = async (row) => {
    try {
      await setUserAccess(row.id, !row.accessGranted);
      reload();
    } catch (err) {
      setError(err.message || "Modification de l'accès impossible.");
    }
  };

  // Colonnes = champs de base + colonne « Accès » (bouton bascule, capturant le handler).
  const columns = [
    ...COLUMNS,
    {
      key: "accessGranted",
      label: "Accès",
      render: (row) =>
        row.role === "ADMIN" ? (
          <span className="accessTag isGranted">Accordé</span>
        ) : (
          <button
            type="button"
            className={`accessToggle ${row.accessGranted ? "isGranted" : "isBlocked"}`}
            onClick={() => handleToggleAccess(row)}
            title={row.accessGranted ? "Cliquer pour bloquer l'accès" : "Cliquer pour accorder l'accès"}
          >
            {row.accessGranted ? "Accordé" : "Bloqué"}
          </button>
        ),
    },
  ];

  return (
    <div className="adminPage">
      <header className="adminPageHeader">
        <h1>Utilisateurs</h1>
        <button className="adminBtn adminBtnPrimary" type="button" onClick={openCreate}>
          + Nouvel utilisateur
        </button>
      </header>

      <div className="adminFilters">
        <label className="adminField">
          <span>Recherche</span>
          <input
            className="adminInput"
            type="text"
            placeholder="Nom, prénom ou email…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </label>
        <label className="adminField">
          <span>Rôle</span>
          <select className="adminInput" value={roleFilter} onChange={(e) => setParams({ role: e.target.value }, { resetPage: true })}>
            <option value="">Tous</option>
            <option value="STUDENT">Étudiant</option>
            <option value="ADMIN">Administrateur</option>
          </select>
        </label>
      </div>

      {error && <p className="adminError">{error}</p>}

      <AdminTable
        columns={columns}
        rows={items}
        onEdit={openEdit}
        onDelete={handleDelete}
        emptyLabel="Aucun utilisateur."
      />

      <AdminPagination page={page - 1} totalPages={totalPages} onChange={(p) => setParams({ page: p + 1 })} />

      {modalOpen && (
        <AdminFormModal
          title={editing ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
          fields={buildFields}
          initialValues={editing ? toFormValues(editing) : null}
          onSubmit={handleSubmit}
          onClose={() => setModalOpen(false)}
          submitting={submitting}
          error={formError}
        />
      )}
    </div>
  );
};

export default AdminUsers;
