import { useEffect, useState } from "react";
import { getStudentSubscriptions, createSubscription, deleteSubscription } from "../../service/api";

// Modal de gestion des abonnements d'un étudiant : liste + ajout (classe + période) + révocation.
const SubscriptionModal = ({ student, classes, onClose }) => {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [classId, setClassId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const reload = () => setReloadKey((k) => k + 1);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await getStudentSubscriptions(student.id);
        if (active) { setSubs(data); setError(""); }
      } catch (err) {
        if (active) setError(err.message || "Chargement impossible.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [student.id, reloadKey]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await createSubscription(student.id, { classId, startDate, endDate });
      setClassId(""); setStartDate(""); setEndDate("");
      reload();
    } catch (err) {
      setError(err.message || "Création impossible.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRevoke = async (sub) => {
    if (!window.confirm(`Révoquer l'abonnement « ${sub.classTitle} » ?`)) return;
    try {
      await deleteSubscription(sub.id);
      reload();
    } catch (err) {
      setError(err.message || "Révocation impossible.");
    }
  };

  const formatDate = (iso) => (iso ? new Date(iso).toLocaleDateString("fr-FR") : "—");

  return (
    <div className="adminModalOverlay" onClick={onClose}>
      <div className="adminModal" onClick={(e) => e.stopPropagation()}>
        <div className="adminModalHeader">
          <h2>Abonnements — {student.firstName} {student.lastName}</h2>
          <button className="adminModalClose" type="button" onClick={onClose} aria-label="Fermer">×</button>
        </div>

        {error && <p className="adminError">{error}</p>}

        {/* Formulaire d'ajout */}
        <form className="adminForm" onSubmit={handleAdd}>
          <label className="adminField">
            <span>Classe <i className="adminRequired">*</i></span>
            <select className="adminInput" value={classId} onChange={(e) => setClassId(e.target.value)} required>
              <option value="">— Choisir une classe —</option>
              {classes.map((c) => (
                <option key={c.id} value={String(c.id)}>{c.title} ({c.level})</option>
              ))}
            </select>
          </label>
          <div className="adminSectionRow">
            <label className="adminField">
              <span>Début <i className="adminRequired">*</i></span>
              <input className="adminInput" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
            </label>
            <label className="adminField">
              <span>Fin <i className="adminRequired">*</i></span>
              <input className="adminInput" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
            </label>
            <button className="adminBtn adminBtnPrimary" type="submit" disabled={submitting}>
              {submitting ? "..." : "Ajouter"}
            </button>
          </div>
        </form>

        {/* Liste des abonnements existants */}
        <div style={{ marginTop: 18 }}>
          {loading ? (
            <p className="adminEmpty">Chargement…</p>
          ) : subs.length === 0 ? (
            <p className="adminEmpty">Aucun abonnement.</p>
          ) : (
            <div className="adminTableWrap">
              <table className="adminTable">
                <thead>
                  <tr><th>Classe</th><th>Période</th><th>Statut</th><th className="adminTableActions">Actions</th></tr>
                </thead>
                <tbody>
                  {subs.map((sub) => (
                    <tr key={sub.id}>
                      <td>{sub.classTitle}</td>
                      <td className="adminNowrap">{formatDate(sub.startDate)} → {formatDate(sub.endDate)}</td>
                      <td>
                        <span className={`accessTag ${sub.active ? "isGranted" : "isBlocked"}`}>
                          {sub.active ? "Actif" : "Expiré / à venir"}
                        </span>
                      </td>
                      <td className="adminTableActions">
                        <button className="adminBtn adminBtnDanger" type="button" onClick={() => handleRevoke(sub)}>
                          Révoquer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="adminModalActions">
          <button className="adminBtn adminBtnGhost" type="button" onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
